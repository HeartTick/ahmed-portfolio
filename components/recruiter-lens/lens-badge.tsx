/**
 * "Relevant to this lens" tag. Hidden by default; CSS shows it (sitting on the
 * card's top border, absolutely positioned so it never shifts layout) when the
 * enclosing card matches the active Recruiter Lens.
 */
export function LensBadge() {
  return (
    <span className="lens-badge">
      <span aria-hidden="true" className="size-1.5 rounded-full bg-cyan" />
      Relevant to this lens
    </span>
  );
}
