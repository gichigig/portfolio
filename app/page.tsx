import BackToTop from "@/components/BackToTop";
import ContactLinks from "@/components/ContactLinks";
import Hero from "@/components/Hero";
import ProjectsShowcase from "@/components/ProjectsShowcase";
import SectionHeader from "@/components/SectionHeader";
import SiteHeader, { SiteNavItem } from "@/components/SiteHeader";
import { coreStrengths, profile, securityFocus, stackGroups } from "@/data/profile";
import { flagshipProjects, minorProjects } from "@/data/projects";

export default function Home() {
  const navItems: SiteNavItem[] = [
    { label: "Home", href: "/#hero", sectionId: "hero" },
    { label: "About", href: "/#about", sectionId: "about" },
    { label: "Projects", href: "/#projects", sectionId: "projects" },
    { label: "Stack", href: "/#stack", sectionId: "stack" },
    { label: "More", href: "/#minor", sectionId: "minor" },
    { label: "Contact", href: "/#contact", sectionId: "contact" },
  ];

  return (
    <div className="site-shell">
      <SiteHeader navItems={navItems} resumeHref={profile.resumeHref} />

      <main className="content-shell">
        <Hero
          profile={profile}
          flagshipCount={flagshipProjects.length}
          minorCount={minorProjects.length}
        />

        <section id="about" className="section-block motion-safe-reveal motion-delay-1">
          <SectionHeader
            eyebrow="01 About"
            title="I build secure product systems from idea to deployment."
            description="My focus is practical software that survives real users, real workflows, and real operational pressure."
          />
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {coreStrengths.map((strength) => (
              <article key={strength} className="surface-card p-5">
                <p className="text-sm sm:text-base text-muted">{strength}</p>
              </article>
            ))}
          </div>
        </section>

        <ProjectsShowcase
          flagshipProjects={flagshipProjects}
          minorProjects={minorProjects}
        />

        <section id="stack" className="section-block motion-safe-reveal motion-delay-3">
          <SectionHeader
            eyebrow="04 Stack + Security"
            title="Cross-platform delivery with security as a default."
            description="I work across mobile, web, backend, and payment workflows while keeping authentication and access controls first-class."
          />
          <div className="mt-6 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {stackGroups.map((group) => (
                <article key={group.title} className="surface-card p-5">
                  <h3 className="text-base font-medium">{group.title}</h3>
                  <p className="mt-3 code-text text-xs text-muted">
                    {group.tools.join(" | ")}
                  </p>
                </article>
              ))}
            </div>
            <article className="surface-card p-5 sm:p-6">
              <h3 className="text-lg font-semibold">Security Focus</h3>
              <ul className="mt-4 space-y-2 text-sm text-muted">
                {securityFocus.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-2 block h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <section id="contact" className="section-block">
          <SectionHeader
            eyebrow="05 Contact"
            title="Open to software engineering opportunities and collaborations."
            description="Reach out through email or social channels. The command palette also supports 'contact' and 'copy email'."
          />
          <div className="mt-6">
            <ContactLinks profile={profile} />
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--border)] px-4 py-8 text-center text-sm text-muted">
        Built by {profile.name}. Focused on secure full-stack software systems.
      </footer>

      <BackToTop />
    </div>
  );
}
