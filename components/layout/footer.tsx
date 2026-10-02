import { siteConfig } from "@/config/site";
import { SocialLinks } from "@/components/ui/social-links";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-10 sm:flex-row sm:items-center sm:px-6 lg:px-8">
        <div className="text-sm text-subtle">
          <p className="text-muted">
            © {year} {siteConfig.name} · {siteConfig.location}
          </p>
          <p className="mt-1">Built with Next.js, TypeScript and Tailwind CSS.</p>
        </div>
        <SocialLinks />
      </div>
    </footer>
  );
}
