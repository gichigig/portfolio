"use client";

import Link from "next/link";
import { useState } from "react";
import { Profile } from "@/types/portfolio";

interface ContactLinksProps {
  profile: Profile;
}

type CopyState = "idle" | "copied" | "error";

export default function ContactLinks({ profile }: ContactLinksProps) {
  const [copyState, setCopyState] = useState<CopyState>("idle");

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 1600);
    } catch {
      setCopyState("error");
      window.setTimeout(() => setCopyState("idle"), 1600);
    }
  };

  return (
    <div className="surface-card p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href={`mailto:${profile.email}`}
          className="inline-flex items-center rounded-full border border-[var(--accent)] bg-[var(--accent)] px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-[var(--accent-strong)]"
        >
          {profile.email}
        </Link>
        <button
          type="button"
          className="inline-flex items-center rounded-full border border-[var(--border)] px-4 py-2 text-sm text-muted transition-colors hover:border-[var(--accent)] hover:text-accent"
          onClick={copyEmail}
        >
          {copyState === "copied" && "Copied"}
          {copyState === "error" && "Copy Failed"}
          {copyState === "idle" && "Copy Email"}
        </button>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        {profile.socials.map((social) => (
          <Link
            key={social.label}
            href={social.href}
            className="inline-flex items-center rounded-full border border-[var(--border)] px-4 py-2 text-sm text-muted transition-colors hover:border-[var(--accent)] hover:text-accent"
            target="_blank"
            rel="noreferrer noopener"
          >
            {social.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
