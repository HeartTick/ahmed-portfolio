-- =============================================================================
-- Portfolio V2.2: contact inquiries + anonymous usage protection
-- =============================================================================
--
-- Access model
--   Only trusted Next.js server code touches these tables, using the Supabase
--   secret key (Postgres role: service_role). Browsers never talk to the
--   database directly.
--
--   * Row Level Security is enabled on every table and NO policies are
--     created, so the anon and authenticated roles (publishable/anon keys,
--     signed-in users) can never read or write rows.
--   * Table and function privileges are additionally revoked from public,
--     anon and authenticated (defense in depth: Supabase grants them broad
--     privileges on new public objects by default).
--   * The application writes only through the functions below, which run as
--     the caller (security invoker) with an empty search_path.
--
-- Data minimization
--   No IP addresses, user agents, AI questions, AI answers or raw session
--   identifiers are stored. Usage tables hold a SHA-256 hash of a random
--   cookie value, a UTC date and a counter. Old usage rows are pruned
--   automatically.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- Shared trigger: keep updated_at current on manual edits (e.g. status changes
-- in the Supabase table editor).
-- -----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;


-- -----------------------------------------------------------------------------
-- 1. Contact inquiries
-- -----------------------------------------------------------------------------
create table public.contact_inquiries (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(name) between 2 and 80),
  email       text not null check (
                char_length(email) between 6 and 254
                and email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'
              ),
  company     text check (company is null or char_length(company) between 1 and 100),
  message     text not null check (char_length(message) between 10 and 2000),
  status      text not null default 'new' check (status in ('new', 'read', 'archived')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.contact_inquiries is
  'Messages sent through the portfolio contact form. Stored only to respond to the inquiry. Manage via the status column (new / read / archived).';
comment on column public.contact_inquiries.status is 'Workflow status: new, read or archived.';

create index contact_inquiries_status_created_at_idx
  on public.contact_inquiries (status, created_at desc);

create trigger contact_inquiries_set_updated_at
  before update on public.contact_inquiries
  for each row execute function public.set_updated_at();


-- Successful contact submissions per anonymous session per UTC day.
create table public.contact_usage_daily (
  session_hash      text not null check (session_hash ~ '^[0-9a-f]{64}$'),
  usage_date        date not null,
  submission_count  integer not null default 0 check (submission_count >= 0),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  primary key (session_hash, usage_date)
);

comment on table public.contact_usage_daily is
  'Contact-form throttling only. session_hash is a SHA-256 hash of a random cookie value; no message content or personal data.';

create index contact_usage_daily_usage_date_idx on public.contact_usage_daily (usage_date);


-- -----------------------------------------------------------------------------
-- 2. Ask Ahmed AI usage
-- -----------------------------------------------------------------------------
create table public.ai_usage_daily (
  session_hash   text not null check (session_hash ~ '^[0-9a-f]{64}$'),
  usage_date     date not null,
  request_count  integer not null default 0 check (request_count >= 0),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  primary key (session_hash, usage_date)
);

comment on table public.ai_usage_daily is
  'Ask Ahmed AI daily quota per anonymous session. Counts only: no questions, answers or identifiers beyond a SHA-256 hash of a random cookie value.';

create index ai_usage_daily_usage_date_idx on public.ai_usage_daily (usage_date);


-- Site-wide daily total: a second safety layer that holds even if visitors
-- clear cookies or create many sessions.
create table public.ai_usage_global_daily (
  usage_date     date primary key,
  request_count  integer not null default 0 check (request_count >= 0),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

comment on table public.ai_usage_global_daily is
  'Ask Ahmed AI requests across all visitors per UTC day.';


-- -----------------------------------------------------------------------------
-- consume_ai_quota: atomically check and count one Ask Ahmed AI request.
--
-- Row locks (SELECT ... FOR UPDATE) serialize concurrent calls, so parallel
-- requests can't slip past either limit. Locks are always taken in the same
-- order (global row, then session row), which rules out deadlocks.
-- -----------------------------------------------------------------------------
create function public.consume_ai_quota(
  p_session_hash  text,
  p_session_limit integer,
  p_global_limit  integer
)
returns table (allowed boolean, reason text, session_remaining integer, quota_date date)
language plpgsql
volatile
set search_path = ''
as $$
declare
  v_today    date := (now() at time zone 'utc')::date;
  v_global   integer;
  v_session  integer;
  v_inserted integer;
begin
  if p_session_hash is null or p_session_hash !~ '^[0-9a-f]{64}$' then
    raise exception 'invalid session hash' using errcode = '22023';
  end if;
  if coalesce(p_session_limit, 0) < 1 or coalesce(p_global_limit, 0) < 1 then
    raise exception 'invalid limits' using errcode = '22023';
  end if;

  -- Global row first. The first request of a new day also prunes old rows.
  insert into public.ai_usage_global_daily (usage_date)
  values (v_today)
  on conflict on constraint ai_usage_global_daily_pkey do nothing;
  get diagnostics v_inserted = row_count;
  if v_inserted > 0 then
    delete from public.ai_usage_daily d where d.usage_date < v_today - 7;
    delete from public.ai_usage_global_daily g where g.usage_date < v_today - 90;
  end if;

  select g.request_count into v_global
  from public.ai_usage_global_daily g
  where g.usage_date = v_today
  for update;

  -- Then the session row.
  insert into public.ai_usage_daily (session_hash, usage_date)
  values (p_session_hash, v_today)
  on conflict on constraint ai_usage_daily_pkey do nothing;

  select d.request_count into v_session
  from public.ai_usage_daily d
  where d.session_hash = p_session_hash and d.usage_date = v_today
  for update;

  if v_session >= p_session_limit then
    return query select false, 'session_limit'::text, 0, v_today;
    return;
  end if;

  if v_global >= p_global_limit then
    return query select false, 'global_limit'::text, p_session_limit - v_session, v_today;
    return;
  end if;

  update public.ai_usage_global_daily g
  set request_count = g.request_count + 1, updated_at = now()
  where g.usage_date = v_today;

  update public.ai_usage_daily d
  set request_count = d.request_count + 1, updated_at = now()
  where d.session_hash = p_session_hash and d.usage_date = v_today;

  return query select true, 'ok'::text, p_session_limit - v_session - 1, v_today;
end;
$$;

comment on function public.consume_ai_quota(text, integer, integer) is
  'Atomically checks the per-session and global daily Ask Ahmed AI limits and counts the request if allowed.';


-- refund_ai_quota: give back a counted request when the AI provider failed
-- before answering (e.g. provider outage), so visitors don't lose quota.
create function public.refund_ai_quota(p_session_hash text, p_usage_date date)
returns void
language plpgsql
volatile
set search_path = ''
as $$
begin
  if p_session_hash is null or p_session_hash !~ '^[0-9a-f]{64}$' or p_usage_date is null then
    raise exception 'invalid arguments' using errcode = '22023';
  end if;

  -- Same lock order as consume_ai_quota.
  update public.ai_usage_global_daily g
  set request_count = greatest(g.request_count - 1, 0), updated_at = now()
  where g.usage_date = p_usage_date;

  update public.ai_usage_daily d
  set request_count = greatest(d.request_count - 1, 0), updated_at = now()
  where d.session_hash = p_session_hash and d.usage_date = p_usage_date;
end;
$$;


-- -----------------------------------------------------------------------------
-- submit_contact_inquiry: atomically enforce the per-session daily limit and
-- store the inquiry. Only successful submissions are counted.
-- -----------------------------------------------------------------------------
create function public.submit_contact_inquiry(
  p_session_hash text,
  p_daily_limit  integer,
  p_name         text,
  p_email        text,
  p_company      text,
  p_message      text
)
returns table (allowed boolean, remaining integer)
language plpgsql
volatile
set search_path = ''
as $$
declare
  v_today    date := (now() at time zone 'utc')::date;
  v_count    integer;
  v_inserted integer;
begin
  if p_session_hash is null or p_session_hash !~ '^[0-9a-f]{64}$' then
    raise exception 'invalid session hash' using errcode = '22023';
  end if;
  if coalesce(p_daily_limit, 0) < 1 then
    raise exception 'invalid limit' using errcode = '22023';
  end if;

  insert into public.contact_usage_daily (session_hash, usage_date)
  values (p_session_hash, v_today)
  on conflict on constraint contact_usage_daily_pkey do nothing;
  get diagnostics v_inserted = row_count;
  if v_inserted > 0 then
    delete from public.contact_usage_daily c where c.usage_date < v_today - 7;
  end if;

  select c.submission_count into v_count
  from public.contact_usage_daily c
  where c.session_hash = p_session_hash and c.usage_date = v_today
  for update;

  if v_count >= p_daily_limit then
    return query select false, 0;
    return;
  end if;

  -- Column constraints validate the values again inside the database.
  insert into public.contact_inquiries (name, email, company, message)
  values (p_name, p_email, nullif(btrim(p_company), ''), p_message);

  update public.contact_usage_daily c
  set submission_count = c.submission_count + 1, updated_at = now()
  where c.session_hash = p_session_hash and c.usage_date = v_today;

  return query select true, p_daily_limit - v_count - 1;
end;
$$;

comment on function public.submit_contact_inquiry(text, integer, text, text, text, text) is
  'Atomically checks the per-session daily contact limit, stores the inquiry and counts it.';


-- -----------------------------------------------------------------------------
-- Row Level Security and privileges
-- -----------------------------------------------------------------------------
alter table public.contact_inquiries     enable row level security;
alter table public.contact_usage_daily   enable row level security;
alter table public.ai_usage_daily        enable row level security;
alter table public.ai_usage_global_daily enable row level security;
-- Intentionally no policies: with RLS enabled and no policy, anon and
-- authenticated see and change nothing. service_role bypasses RLS.

revoke all on table
  public.contact_inquiries,
  public.contact_usage_daily,
  public.ai_usage_daily,
  public.ai_usage_global_daily
from public, anon, authenticated;

grant select, insert, update, delete on table
  public.contact_inquiries,
  public.contact_usage_daily,
  public.ai_usage_daily,
  public.ai_usage_global_daily
to service_role;

revoke all on function public.set_updated_at() from public, anon, authenticated;
revoke all on function public.consume_ai_quota(text, integer, integer) from public, anon, authenticated;
revoke all on function public.refund_ai_quota(text, date) from public, anon, authenticated;
revoke all on function public.submit_contact_inquiry(text, integer, text, text, text, text) from public, anon, authenticated;

grant execute on function public.consume_ai_quota(text, integer, integer) to service_role;
grant execute on function public.refund_ai_quota(text, date) to service_role;
grant execute on function public.submit_contact_inquiry(text, integer, text, text, text, text) to service_role;

-- Ask the Data API (PostgREST) to pick up the new functions immediately.
notify pgrst, 'reload schema';
