"use client";

import type { ComponentPropsWithoutRef, PointerEvent } from "react";
import { cn } from "@/lib/utils";

/**
 * Wraps content in a card whose soft highlight follows the pointer.
 * Only mouse/pen pointers update it; the effect is CSS-gated to hover devices.
 */
export function Spotlight({ className, children, ...props }: ComponentPropsWithoutRef<"div">) {
  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerType === "touch") return;
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
  }

  return (
    <div onPointerMove={onPointerMove} className={cn("card spotlight", className)} {...props}>
      {children}
    </div>
  );
}
