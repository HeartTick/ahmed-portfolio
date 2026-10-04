import { AlertCircle, Download, Mail } from "lucide-react";
import { siteConfig } from "@/config/site";
import { contactFormCopy } from "@/data/contact";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { CopyEmailButton } from "@/components/ui/copy-email-button";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/brand-icons";
import { ContactForm } from "@/components/contact/contact-form";

export function Contact() {
  const { github, linkedin } = siteConfig.social;
  // Only this boolean reaches the client; the form posts to /api/contact.
  const formAvailable = isSupabaseConfigured();
  return (
    <section id="contact" aria-labelledby="contact-heading" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="reveal card relative overflow-hidden px-6 py-12 text-center sm:px-12 sm:py-16">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(40rem_18rem_at_50%_0%,rgb(34_211_238/0.12),transparent_70%),radial-gradient(30rem_16rem_at_50%_100%,rgb(167_139_250/0.10),transparent_70%)]"
          />
          <div className="relative">
            <p className="eyebrow">Contact</p>
            <h2 id="contact-heading" className="mx-auto mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-fg text-balance sm:text-5xl">
              Let&apos;s build reliable software.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted text-pretty">{siteConfig.contactNote}</p>

            <a
              href={`mailto:${siteConfig.email}`}
              className="mt-8 inline-block break-all font-mono text-base text-fg underline decoration-white/20 underline-offset-8 transition-colors hover:decoration-cyan sm:text-lg"
            >
              {siteConfig.email}
            </a>

            <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <a href={`mailto:${siteConfig.email}`} className="btn btn-primary">
                <Mail size={16} aria-hidden="true" />
                Send an email
              </a>
              <CopyEmailButton email={siteConfig.email} />
              <a href={siteConfig.resumePath} download className="btn btn-ghost">
                <Download size={16} aria-hidden="true" />
                Download Résumé
              </a>
            </div>

            {github || linkedin ? (
              <ul className="mt-8 flex items-center justify-center gap-6 text-sm">
                {linkedin ? (
                  <li>
                    <a href={linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted transition-colors hover:text-fg">
                      <LinkedInIcon size={16} />
                      LinkedIn
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  </li>
                ) : null}
                {github ? (
                  <li>
                    <a href={github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted transition-colors hover:text-fg">
                      <GitHubIcon size={16} />
                      GitHub
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  </li>
                ) : null}
              </ul>
            ) : null}

            <div className="mx-auto mt-12 max-w-xl">
              <p className="mb-6 flex items-center gap-4 font-mono text-[11px] uppercase tracking-wider text-subtle">
                <span aria-hidden="true" className="h-px flex-1 bg-line" />
                {contactFormCopy.divider}
                <span aria-hidden="true" className="h-px flex-1 bg-line" />
              </p>
              {formAvailable ? (
                <ContactForm email={siteConfig.email} />
              ) : (
                <p className="flex items-start gap-3 rounded-xl border border-line bg-white/[0.02] p-4 text-left text-sm leading-relaxed text-muted">
                  <AlertCircle size={16} className="mt-0.5 shrink-0 text-blue" aria-hidden="true" />
                  <span>
                    {contactFormCopy.notConfigured}{" "}
                    <a href={`mailto:${siteConfig.email}`} className="font-medium text-fg underline decoration-white/30 underline-offset-4 hover:decoration-cyan">
                      {siteConfig.email}
                    </a>
                    .
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
