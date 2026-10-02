/** Fixed decorative background: colour mesh, fading grid and fine noise. */
export function Backdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="backdrop-mesh absolute inset-0" />
      <div className="backdrop-grid absolute inset-x-0 top-0 h-[110vh]" />
      <div className="noise absolute inset-0" />
    </div>
  );
}
