import Link from "next/link";
import { Project } from "@/types/portfolio";

interface FlagshipProjectCardProps {
  project: Project;
}

export default function FlagshipProjectCard({
  project,
}: FlagshipProjectCardProps) {
  const externalLinks = project.links
    .filter((link) => link.label !== "Case Study")
    .slice(0, 2);

  return (
    <article className="surface-card flex h-full flex-col p-5 sm:p-6">
      <div className="flex-1">
        <p className="section-eyebrow code-text">Flagship</p>
        <h3 className="mt-2 text-xl font-semibold sm:text-2xl">{project.title}</h3>
        <p className="mt-3 text-sm sm:text-base text-muted">{project.summary}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.stack.slice(0, 5).map((tech) => (
            <span key={tech} className="chip code-text">
              {tech}
            </span>
          ))}
        </div>

        <ul className="mt-4 space-y-2 text-sm text-muted">
          {project.features.slice(0, 3).map((feature) => (
            <li key={feature} className="flex gap-2">
              <span className="mt-2 block h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <p className="mt-4 text-sm text-muted">
          <span className="code-text text-accent">Security:</span>{" "}
          {project.security.slice(0, 2).join(" | ")}
        </p>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Link
          href={`/projects/${project.slug}`}
          className="inline-flex items-center rounded-full border border-[var(--accent)] px-4 py-2 text-sm font-medium text-accent transition-colors hover:bg-[rgb(122_210_255_/_12%)]"
        >
          Read Case Study
        </Link>
        {externalLinks.map((link) => {
          const isExternal = link.href.startsWith("http");

          return (
            <Link
              key={`${project.slug}-${link.label}`}
              href={link.href}
              className="inline-flex items-center rounded-full border border-[var(--border)] px-4 py-2 text-sm text-muted transition-colors hover:border-[var(--accent)] hover:text-accent"
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noreferrer noopener" : undefined}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </article>
  );
}
