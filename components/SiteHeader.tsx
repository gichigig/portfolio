"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

export interface SiteNavItem {
  label: string;
  href: string;
  sectionId: string;
}

interface SiteHeaderProps {
  navItems: SiteNavItem[];
  resumeHref: string;
}

export default function SiteHeader({ navItems, resumeHref }: SiteHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState("hero");
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const hasOpenedRef = useRef(false);

  const sectionIds = useMemo(
    () => navItems.map((item) => item.sectionId),
    [navItems],
  );

  const closeMobileMenu = () => setMobileOpen(false);

  useEffect(() => {
    const targets = sectionIds
      .map((sectionId) => document.getElementById(sectionId))
      .filter((element): element is HTMLElement => Boolean(element));

    if (targets.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleEntries.length > 0) {
          setActiveSectionId(visibleEntries[0].target.id);
        }
      },
      {
        rootMargin: "-35% 0px -45% 0px",
        threshold: [0.1, 0.35, 0.6],
      },
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [sectionIds]);

  useEffect(() => {
    const onHashChange = () => {
      const nextHash = window.location.hash.replace("#", "");
      if (nextHash && sectionIds.includes(nextHash)) {
        setActiveSectionId(nextHash);
      }
    };

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [sectionIds]);

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };

    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [mobileOpen]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) {
        setMobileOpen(false);
      }
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const previousOverflowX = document.body.style.overflowX;
    const previousOverflowY = document.body.style.overflowY;

    if (mobileOpen) {
      hasOpenedRef.current = true;
      document.body.style.overflowX = "hidden";
      document.body.style.overflowY = "hidden";
      window.setTimeout(() => closeButtonRef.current?.focus(), 40);
    } else {
      document.body.style.overflowX = previousOverflowX;
      document.body.style.overflowY = previousOverflowY;
      if (hasOpenedRef.current) {
        menuButtonRef.current?.focus();
      }
    }

    return () => {
      document.body.style.overflowX = previousOverflowX;
      document.body.style.overflowY = previousOverflowY;
    };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[rgb(7_9_13_/_88%)] backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/#hero" className="code-text text-xs tracking-[0.24em] text-accent flex items-center gap-4 pr-2">
          <Image
            src="/favicon.ico"
            alt="Billy logo"
            width={20}
            height={20}
            style={{ display: "inline-block", verticalAlign: "middle", marginRight: "0.5rem" }}
          />
          BILLY
        </Link>

        <nav
          aria-label="Primary navigation"
          className="hidden items-center justify-end gap-5 text-sm text-muted md:flex"
        >
          {navItems.map((item) => {
            const isActive = activeSectionId === item.sectionId;

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`header-nav-link ${isActive ? "is-active" : ""}`}
                aria-current={isActive ? "location" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href={resumeHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-full border border-[var(--accent)] px-3 py-1.5 text-xs font-medium text-accent transition-colors hover:bg-[rgb(122_210_255_/_12%)]"
          >
            Resume
          </Link>
        </nav>

        {!mobileOpen ? (
          <button
            ref={menuButtonRef}
            type="button"
            aria-label="Open navigation menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-drawer"
            className="mobile-menu-btn inline-flex md:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <span />
            <span />
            <span />
          </button>
        ) : null}
      </div>

      <div
        className={`mobile-nav-overlay ${mobileOpen ? "is-open" : ""}`}
        onClick={closeMobileMenu}
      />

      <aside
        id="mobile-nav-drawer"
        aria-hidden={!mobileOpen}
        className={`mobile-nav-drawer ${mobileOpen ? "is-open" : ""}`}
      >
        <div className="mb-4 flex items-center justify-between">
          <p className="code-text text-xs tracking-[0.2em] text-accent">MENU</p>
          <button
            ref={closeButtonRef}
            type="button"
            className="rounded-md border border-[var(--border)] px-2 py-1 text-xs text-muted transition-colors hover:border-[var(--accent)] hover:text-accent"
            onClick={closeMobileMenu}
          >
            Close
          </button>
        </div>

        <nav aria-label="Mobile primary navigation" className="grid gap-2">
          {navItems.map((item) => {
            const isActive = activeSectionId === item.sectionId;

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`mobile-nav-link ${isActive ? "is-active" : ""}`}
                aria-current={isActive ? "location" : undefined}
                onClick={closeMobileMenu}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Link
          href={resumeHref}
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-flex items-center justify-center rounded-full border border-[var(--accent)] bg-[var(--accent)] px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-[var(--accent-strong)]"
          onClick={closeMobileMenu}
        >
          Download Resume
        </Link>
      </aside>
    </header>
  );
}
