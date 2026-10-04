/** Joins truthy class names. Small enough not to need a dependency. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/** `wideOnly` items are hidden from the desktop bar below 1024px (still in the mobile menu). */
export const navItems: ReadonlyArray<{ id: string; label: string; wideOnly?: boolean }> = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
  { id: "ask", label: "Ask AI", wideOnly: true },
  { id: "contact", label: "Contact" },
];
