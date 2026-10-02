"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = { email: string; className?: string };

export function CopyEmailButton({ email, className }: Props) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2200);
    } catch {
      // Clipboard can be blocked (insecure context, permissions): fall back to mail client.
      window.location.href = `mailto:${email}`;
    }
  }

  return (
    <button type="button" onClick={handleCopy} className={cn("btn btn-ghost", className)}>
      {copied ? (
        <Check size={16} className="text-cyan" aria-hidden="true" />
      ) : (
        <Copy size={16} aria-hidden="true" />
      )}
      <span>{copied ? "Copied to clipboard" : "Copy email"}</span>
      <span className="sr-only" role="status" aria-live="polite">
        {copied ? `${email} copied to clipboard` : ""}
      </span>
    </button>
  );
}
