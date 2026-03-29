"use client";

import { useMemo, useState } from "react";
import FlagshipProjectCard from "@/components/FlagshipProjectCard";
import MinorProjectList from "@/components/MinorProjectList";
import SectionHeader from "@/components/SectionHeader";
import { Project } from "@/types/portfolio";

const FILTER_TAGS = [
  "All",
  "Flutter",
  "React",
  "Spring Boot",
  "Node.js",
  "Python",
] as const;

interface ProjectsShowcaseProps {
  flagshipProjects: Project[];
  minorProjects: Project[];
}

const matchesFilter = (project: Project, activeFilter: string) => {
  if (activeFilter === "All") {
    return true;
  }

  const expected = activeFilter.toLowerCase();
  return project.stack.some((stackItem) => stackItem.toLowerCase().includes(expected));
};

export default function ProjectsShowcase({
  flagshipProjects,
  minorProjects,
}: ProjectsShowcaseProps) {
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const filteredFlagship = useMemo(
    () =>
      flagshipProjects.filter((project) => matchesFilter(project, activeFilter)),
    [activeFilter, flagshipProjects],
  );

  const filteredMinor = useMemo(
    () => minorProjects.filter((project) => matchesFilter(project, activeFilter)),
    [activeFilter, minorProjects],
  );

  return (
    <>
      <section id="projects" className="section-block motion-safe-reveal motion-delay-2">
        <SectionHeader
          eyebrow="02 Flagship Work"
          title="High-impact systems across rentals, hospitality, and education."
          description="Use stack filters to quickly evaluate the technologies behind each build."
        />

        <div className="mt-5 flex flex-wrap gap-2">
          {FILTER_TAGS.map((tag) => {
            const isActive = activeFilter === tag;
            return (
              <button
                key={tag}
                type="button"
                className={`filter-chip ${isActive ? "is-active" : ""}`}
                aria-pressed={isActive}
                onClick={() => setActiveFilter(tag)}
              >
                {tag}
              </button>
            );
          })}
        </div>

        {filteredFlagship.length === 0 ? (
          <article className="surface-card mt-6 p-5 text-sm text-muted sm:p-6">
            No flagship projects match the selected filter.
          </article>
        ) : (
          <div className="mt-6 grid gap-5 lg:grid-cols-3">
            {filteredFlagship.map((project) => (
              <FlagshipProjectCard key={project.slug} project={project} />
            ))}
          </div>
        )}
      </section>

      <section id="minor" className="section-block">
        <SectionHeader
          eyebrow="03 Additional Builds"
          title="A broad set of production-style side projects."
          description="Filtered with the same selected stack tag for faster technical scanning."
        />

        {filteredMinor.length === 0 ? (
          <article className="surface-card mt-6 p-5 text-sm text-muted sm:p-6">
            No minor projects match the selected filter.
          </article>
        ) : (
          <div className="mt-6">
            <MinorProjectList projects={filteredMinor} />
          </div>
        )}
      </section>
    </>
  );
}
