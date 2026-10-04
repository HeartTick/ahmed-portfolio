import { siteConfig } from "@/config/site";
import { education } from "@/data/education";
import { skillGroups } from "@/data/skills";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Experience } from "@/components/sections/experience";
import { Practice } from "@/components/sections/practice";
import { Projects } from "@/components/sections/projects";
import { Skills } from "@/components/sections/skills";
import { HowIBuild } from "@/components/sections/how-i-build";
import { Education } from "@/components/sections/education";
import { Contact } from "@/components/sections/contact";
import { AskAhmedSection } from "@/components/sections/ask-ahmed-section";
import { Section } from "@/components/ui/section";
import { LensSelector } from "@/components/recruiter-lens/lens-selector";
import { LensStatus } from "@/components/recruiter-lens/lens-status";

function PersonJsonLd() {
  const sameAs = [siteConfig.social.github, siteConfig.social.linkedin].filter(Boolean);
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    jobTitle: siteConfig.role,
    url: siteConfig.url,
    email: `mailto:${siteConfig.email}`,
    address: { "@type": "PostalAddress", addressLocality: "Dresden", addressCountry: "DE" },
    alumniOf: education.map((e) => ({ "@type": "CollegeOrUniversity", name: e.institution })),
    knowsAbout: Array.from(new Set(skillGroups.flatMap((g) => g.skills))),
    knowsLanguage: ["English", "German"],
    sameAs,
  };
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe here: all values come from local config.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export default function HomePage() {
  return (
    <>
      <PersonJsonLd />
      <Hero />
      <LensSelector />
      <About />
      <Experience />
      <Practice />
      <Projects />
      <Skills />
      <Section
        id="process"
        eyebrow="How I build"
        title="From raw input to observed system"
        intro="The workflow I follow when building a data-handling service. Select a stage to see the tools involved."
      >
        <HowIBuild />
      </Section>
      <Education />
      <AskAhmedSection />
      <Contact />
      <LensStatus />
    </>
  );
}
