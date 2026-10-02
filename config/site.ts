/**
 * Central site configuration.
 *
 * Identity, contact details, links and deployment settings live here so they
 * never need to be hunted down inside components. Values marked "OPTIONAL"
 * can be left as `null` and the UI will hide the related element.
 */

function resolveSiteUrl(): string {
  // 1. Explicit override (set this once a custom domain is attached).
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  // 2. Vercel injects the production domain automatically at build time.
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  // 3. Local development fallback.
  return "http://localhost:3000";
}

export const siteConfig = {
  name: "Ahmed Khan Patan",
  shortName: "Ahmed",
  initials: "AK",
  role: "Python Software Engineer",
  focusAreas: ["Backend Systems", "APIs", "AWS", "Data Workflows"],
  title: "Ahmed Khan Patan | Python Software Engineer",
  description:
    "Python software engineer in Dresden building backend services, REST APIs, data workflows and AWS-based automation. M.Sc. Computational Modeling and Simulation student at TU Dresden.",
  url: resolveSiteUrl(),
  location: "Dresden, Germany",
  email: "patanahmedk@gmail.com",

  /** Public résumé served from /public. Replace the file to update it. */
  resumePath: "/Ahmed_Khan_Patan_Resume.pdf",

  /** Extracted from the hyperlinks embedded in the résumé PDF. Set to null to hide. */
  social: {
    github: "https://github.com/HeartTick" as string | null,
    linkedin: "https://www.linkedin.com/in/patan-ahmed-khan-a20310225/" as string | null,
  },

  /**
   * OPTIONAL: path to a professional headshot inside /public, for example
   * "/images/portrait.jpg". While null, an initials monogram is shown instead.
   */
  portrait: null as string | null,

  /** Short line shown in the contact section. Edit freely. */
  contactNote:
    "Based in Dresden. Happy to talk about software engineering, backend and working-student roles in Germany and across Europe.",
} as const;

export type SiteConfig = typeof siteConfig;
