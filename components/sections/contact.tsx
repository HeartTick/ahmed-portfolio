import { Download, Mail } from "lucide-react";
import { siteConfig } from "@/config/site";
import { CopyEmailButton } from "@/components/ui/copy-email-button";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/brand-icons";

export function Contact() {
  const { github, linkedin } = siteConfig.social;
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
          </div>
        </div>
      </div>
    </section>
  );
}
