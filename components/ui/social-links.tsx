import { Mail } from "lucide-react";
import { siteConfig } from "@/config/site";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/brand-icons";
import { cn } from "@/lib/utils";

/** GitHub / LinkedIn / Email icon links. Missing URLs are simply not rendered. */
export function SocialLinks({ className }: { className?: string }) {
  const { github, linkedin } = siteConfig.social;
  return (
    <ul className={cn("flex items-center gap-2", className)} aria-label="Profiles and contact">
      {github ? (
        <li>
          <a href={github} target="_blank" rel="noopener noreferrer" className="icon-btn" aria-label="GitHub profile (opens in a new tab)" title="GitHub">
            <GitHubIcon />
          </a>
        </li>
      ) : null}
      {linkedin ? (
        <li>
          <a href={linkedin} target="_blank" rel="noopener noreferrer" className="icon-btn" aria-label="LinkedIn profile (opens in a new tab)" title="LinkedIn">
            <LinkedInIcon />
          </a>
        </li>
      ) : null}
      <li>
        <a href={`mailto:${siteConfig.email}`} className="icon-btn" aria-label={`Email ${siteConfig.name}`} title={siteConfig.email}>
          <Mail size={18} aria-hidden="true" />
        </a>
      </li>
    </ul>
  );
}
