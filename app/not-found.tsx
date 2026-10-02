import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-4 pt-24 text-center">
      <p className="font-mono text-sm text-cyan">404</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-fg">Page not found</h1>
      <p className="mt-3 text-muted">This route doesn&apos;t exist. The rest of the site is one click away.</p>
      <Link href="/" className="btn btn-ghost mt-8">
        <ArrowLeft size={16} aria-hidden="true" />
        Back to home
      </Link>
    </section>
  );
}
