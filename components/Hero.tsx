import Link from "next/link";
import { Profile } from "@/types/portfolio";

interface HeroProps {
  profile: Profile;
  flagshipCount: number;
  minorCount: number;
}

export default function Hero({ profile, flagshipCount, minorCount }: HeroProps) {
  return (
    <section id="hero" className="motion-safe-reveal">
      <div className="hero-shell">
        <p className="section-eyebrow code-text">Software Engineer Portfolio</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl">
          {profile.name}
          <span className="block text-accent">{profile.title}</span>
        </h1>
        <p className="mt-5 max-w-3xl text-base sm:text-lg text-muted">
          {profile.tagline}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span className="chip code-text">{flagshipCount} flagship systems</span>
          <span className="chip code-text">{minorCount} additional projects</span>
          <span className="chip code-text">{profile.location}</span>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/#projects"
            className="inline-flex items-center rounded-full border border-[var(--accent)] bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-black transition-colors hover:bg-[var(--accent-strong)]"
          >
            Explore Projects
          </Link>
          <Link
            href="/#contact"
            className="inline-flex items-center rounded-full border border-[var(--border)] px-5 py-2.5 text-sm font-medium transition-colors hover:border-[var(--accent)] hover:text-accent"
          >
            Contact Me
          </Link>
        </div>
      </div>
    </section>
  );
}
