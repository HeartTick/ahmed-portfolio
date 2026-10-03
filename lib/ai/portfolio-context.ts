import "server-only";

import { siteConfig } from "@/config/site";
import { hobbies, languages, technicalInterests } from "@/data/profile";
import { experience, pipelineFact } from "@/data/experience";
import { projects } from "@/data/projects";
import { skillGroups } from "@/data/skills";
import { education } from "@/data/education";

/**
 * Builds the grounding context for the assistant from the same data files
 * that render the site, so there is no second copy of Ahmed's profile.
 *
 * Only factual, résumé-level data is included. Descriptive site copy (the
 * About narrative, "Engineering in practice", "How I build") is deliberately
 * left out: it describes typical work in general terms, and models tend to
 * turn it into specific implementation claims.
 *
 * Each fact is emitted as a separate line with its scope stated, so the model
 * can cite facts individually instead of merging them.
 */

const list = (items: readonly string[]) => items.map((i) => `- ${i}`).join("\n");

function buildContext(): string {
  const roles = experience;
  const sections: string[] = [];

  sections.push(`## Identity and contact
- Name: ${siteConfig.name}
- Positioning on the site: ${siteConfig.role}
- Location: ${siteConfig.location}
- Public email: ${siteConfig.email}
- GitHub: ${siteConfig.social.github ?? "not listed"}
- LinkedIn: ${siteConfig.social.linkedin ?? "not listed"}
- Résumé: downloadable from the site (Download Résumé button)
- Contact note on the site, in Ahmed's words: "${siteConfig.contactNote}"`);

  sections.push(`## Professional experience
Total professional experience: approximately 15 months, combined across the ${roles.length} roles below (both at ${roles[0].company}). No other employers are listed.
How long Ahmed used any individual technology is NOT stated anywhere.

${roles
  .map(
    (r) => `### ${r.title} at ${r.company} (${r.companyLegal}), ${r.start} – ${r.end}, ${r.mode}
One-line summary (use this wording when mentioning the role in passing): ${r.summary}
Résumé statements for this role (each line is a separate fact; keep its exact meaning and verbs, and never merge two lines into one sentence):
${list(r.highlights)}
Technologies: ${r.stack.join(", ")}.
(These apply to the role as a whole. They don't say which technology was used for which task, how technologies were combined, or for how long.)
Nothing else is stated about this role. Don't attribute other roles' work or technologies to it.`,
  )
  .join("\n\n")}

### The automation pipeline (Associate Developer role)
- Ahmed designed an automation pipeline of ${pipelineFact.systems} systems spanning ${pipelineFact.accounts} AWS accounts.
- Ahmed validated the data movement using ${pipelineFact.verification.join(", ").toLowerCase()} (he did the validating; the pipeline is not the subject).
- Not published: system names, which AWS services or tools the pipeline used, how it was deployed or operated, its scale or results. The company's systems are confidential.`);

  sections.push(`## Academic projects
These are academic (university) projects, not professional work. No accuracy, performance or outcome metrics are published for them.

${projects
  .map(
    (p) => `### ${p.title}
- Type: ${p.badge}
- Technologies: ${p.tech.join(", ")}
- Summary: ${p.summary}
- Workflow: ${p.approach.join(" ")}
- What Ahmed built:
${p.highlights.map((h) => `  - ${h}`).join("\n")}${p.disclaimer ? `\n- Note: ${p.disclaimer}` : ""}
- Public links: ${p.links.length ? p.links.map((l) => `${l.label}: ${l.href}`).join(", ") : "none published"}`,
  )
  .join("\n\n")}`);

  sections.push(`## Skills listed on the site
(These appear in the skills list of his résumé. A listed skill on its own does not establish familiarity level, depth, duration, or professional use. Professional use is only established where a role above mentions it.)
${list(skillGroups.map((g) => `${g.title}: ${g.skills.join(", ")}`))}`);

  sections.push(`## Education
${list(
  education.map(
    (e) =>
      `${e.degree}, ${e.institution}, ${e.location}, ${e.start} – ${e.end}${e.status ? `, status: ${e.status.toLowerCase()}` : ""}${e.note ? `, ${e.note}` : ""}`,
  ),
)}`);

  sections.push(`## Languages and personal
${list(languages.map((l) => `${l.name}: ${l.level}`))}
- Technical interests: ${technicalInterests.join(", ")}
- Hobbies: ${hobbies.join(", ")}`);

  sections.push(`## Not covered by the portfolio
Years or months of experience per technology, team size, job titles other than those above, salary expectations, work-permit or visa status, notice period or start dates, references, certifications, publications, awards, and any technology not named above.`);

  return sections.join("\n\n");
}

/** Computed once per server instance; the data is static. */
let cached: string | null = null;

export function getPortfolioContext(): string {
  cached ??= buildContext();
  return cached;
}
