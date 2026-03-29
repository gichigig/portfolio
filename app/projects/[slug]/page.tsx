import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { flagshipProjects, getProjectBySlug } from "@/data/projects";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return flagshipProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project || project.tier !== "flagship") {
    return {
      title: "Project Not Found | Billy",
      description: "The requested project case study was not found.",
    };
  }

  return {
    title: `${project.title} | Billy`,
    description: project.summary,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project || project.tier !== "flagship") {
    notFound();
  }

  const index = flagshipProjects.findIndex((item) => item.slug === project.slug);
  const nextProject = flagshipProjects[(index + 1) % flagshipProjects.length];

  return (
    <div className="site-shell">
      <main className="content-shell">
        <section className="hero-shell mt-4">
          <p className="section-eyebrow code-text">Case Study</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight sm:text-5xl">
            {project.title}
          </h1>
          <p className="mt-4 max-w-3xl text-base text-muted sm:text-lg">
            {project.summary}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <span key={tech} className="chip code-text">
                {tech}
              </span>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex items-center rounded-full border border-[var(--border)] px-4 py-2 text-sm text-muted transition-colors hover:border-[var(--accent)] hover:text-accent"
            >
              Back to Home
            </Link>
            <Link
              href={`/projects/${nextProject.slug}`}
              className="inline-flex items-center rounded-full border border-[var(--accent)] px-4 py-2 text-sm text-accent transition-colors hover:bg-[rgb(122_210_255_/_12%)]"
            >
              Next Project
            </Link>
          </div>
        </section>

        <section className="section-block">
          <h2 className="section-title">Problem</h2>
          <p className="mt-4 max-w-4xl text-sm text-muted sm:text-base">
            {project.problem}
          </p>
        </section>

        <section className="section-block">
          <h2 className="section-title">Solution</h2>
          <p className="mt-4 max-w-4xl text-sm text-muted sm:text-base">
            {project.solution}
          </p>
        </section>

        <section className="section-block">
          <h2 className="section-title">Architecture</h2>
          <ul className="mt-4 space-y-2 text-sm text-muted sm:text-base">
            {project.architecture.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-2 block h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="section-block grid gap-6 lg:grid-cols-3">
          <article className="surface-card p-5 sm:p-6">
            <h3 className="text-lg font-semibold">Key Features</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted">
              {project.features.map((feature) => (
                <li key={feature} className="flex gap-2">
                  <span className="mt-2 block h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="surface-card p-5 sm:p-6">
            <h3 className="text-lg font-semibold">Security</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted">
              {project.security.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-2 block h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="surface-card p-5 sm:p-6">
            <h3 className="text-lg font-semibold">Business Impact</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted">
              {project.impact.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-2 block h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        </section>
      </main>
    </div>
  );
}
