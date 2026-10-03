"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { Download, Menu, X } from "lucide-react";
import { siteConfig } from "@/config/site";
import { navItems, cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Translucent background once the page has scrolled.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Track which section is in view (home page only).
  useEffect(() => {
    if (!isHome) return;
    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => observer.observe(s));

    // Clear the indicator when back in the hero.
    const onScroll = () => {
      if (window.scrollY < window.innerHeight * 0.4) setActive(null);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [isHome]);

  // Mobile menu: Escape to close, lock page scroll, move focus into the panel.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close the menu when switching to desktop width.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const href = (id: string) => (isHome ? `#${id}` : `/#${id}`);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        aria-hidden="true"
        className="scroll-progress absolute inset-x-0 top-0 h-px bg-gradient-to-r from-cyan via-blue to-violet"
      />
      <nav
        aria-label="Primary"
        className={cn(
          "mx-auto mt-3 flex h-14 w-[calc(100%-1.5rem)] max-w-6xl items-center justify-between rounded-2xl border px-3 transition-[background-color,border-color,box-shadow] duration-300 sm:px-4",
          scrolled || open
            ? "border-line bg-bg/70 shadow-[0_8px_30px_-12px_rgb(0_0_0/0.6)] backdrop-blur-xl"
            : "border-transparent bg-transparent",
        )}
      >
        <Link
          href="/"
          className="group flex items-center gap-2.5 rounded-lg"
          aria-label={`${siteConfig.name}, home`}
          onClick={() => setOpen(false)}
        >
          <span className="grid size-8 place-items-center rounded-lg border border-line-strong bg-surface-2 font-mono text-xs font-semibold tracking-wider text-fg transition-colors group-hover:border-cyan/50">
            {siteConfig.initials}
          </span>
          <span className="hidden text-sm font-medium text-fg sm:inline">{siteConfig.name}</span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const isActive = active === item.id;
            return (
              <li key={item.id} className={cn("relative", item.wideOnly && "hidden lg:block")}>
                <a
                  href={href(item.id)}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "relative z-10 block rounded-lg px-3 py-1.5 text-sm whitespace-nowrap transition-colors",
                    isActive ? "text-fg" : "text-muted hover:text-fg",
                  )}
                >
                  {item.label}
                </a>
                {isActive ? (
                  <motion.span
                    layoutId="nav-indicator"
                    aria-hidden="true"
                    className="absolute inset-0 rounded-lg border border-line bg-white/[0.05]"
                    transition={{ type: "spring", stiffness: 420, damping: 36 }}
                  />
                ) : null}
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href={siteConfig.resumePath}
            download
            className="hidden h-9 items-center gap-2 rounded-lg border border-line-strong bg-white/[0.03] px-3 text-sm text-fg transition-colors hover:bg-white/[0.07] sm:inline-flex"
          >
            <Download size={15} aria-hidden="true" />
            Résumé
          </a>
          <button
            ref={menuButtonRef}
            type="button"
            className="icon-btn size-10 md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        ref={panelRef}
        hidden={!open}
        className="mx-auto mt-2 w-[calc(100%-1.5rem)] rounded-2xl border border-line bg-bg/90 p-2 shadow-2xl backdrop-blur-xl md:hidden"
      >
        <ul className="flex flex-col">
          {navItems.map((item) => (
            <li key={item.id}>
              <a
                href={href(item.id)}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center justify-between rounded-xl px-4 py-3 text-base transition-colors hover:bg-white/[0.05]",
                  active === item.id ? "text-fg" : "text-muted",
                )}
              >
                {item.label}
                {active === item.id ? <span className="size-1.5 rounded-full bg-cyan" aria-hidden="true" /> : null}
              </a>
            </li>
          ))}
          <li className="mt-1 border-t border-line pt-2">
            <a
              href={siteConfig.resumePath}
              download
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-xl px-4 py-3 text-base text-fg hover:bg-white/[0.05]"
            >
              <Download size={16} aria-hidden="true" />
              Download Résumé
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
