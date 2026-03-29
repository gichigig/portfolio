"use client";

import { useEffect, useRef, useState } from "react";
import { Project } from "@/types/portfolio";

interface MinorProjectListProps {
  projects: Project[];
}

type ExpansionLevel = 0 | 1 | 2 | 3;

export default function MinorProjectList({ projects }: MinorProjectListProps) {
  const [expansionBySlug, setExpansionBySlug] = useState<Record<string, ExpansionLevel>>({});
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>[]>>({});

  useEffect(() => {
    const timerGroups = timers.current;
    return () => {
      Object.values(timerGroups).forEach((activeTimers) => {
        activeTimers.forEach((timer) => clearTimeout(timer));
      });
    };
  }, []);

  const startExpansion = (slug: string) => {
    // Clear any previous timers for this card
    if (timers.current[slug]) {
      timers.current[slug].forEach((timer) => clearTimeout(timer));
    }
    setExpansionBySlug((previous) => ({ ...previous, [slug]: 1 }));
    const stageTwoTimer = setTimeout(() => {
      setExpansionBySlug((previous) => ({ ...previous, [slug]: 2 }));
    }, 260);
    const stageThreeTimer = setTimeout(() => {
      setExpansionBySlug((previous) => ({ ...previous, [slug]: 3 }));
    }, 620);
    timers.current[slug] = [stageTwoTimer, stageThreeTimer];
  };

  const resetExpansion = (slug: string) => {
    if (timers.current[slug]) {
      timers.current[slug].forEach((timer) => clearTimeout(timer));
      delete timers.current[slug];
    }
    setExpansionBySlug((previous) => ({ ...previous, [slug]: 0 }));
  };

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <article
          key={project.slug}
          className={`minor-project-card level-${expansionBySlug[project.slug] ?? 0} surface-card p-4`}
          onMouseEnter={() => startExpansion(project.slug)}
          onFocus={() => startExpansion(project.slug)}
          onClick={() => startExpansion(project.slug)}
          onMouseLeave={() => resetExpansion(project.slug)}
          onBlur={() => resetExpansion(project.slug)}
          tabIndex={0}
        >
          <h3 className="text-base font-medium">{project.title}</h3>
          <p className="mt-2 text-sm text-muted">{project.summary}</p>

          <div className="minor-project-extra minor-project-extra-stage-1">
            <p className="mt-3 code-text text-xs text-muted">
              {project.stack.slice(0, 4).join(" | ")}
            </p>
          </div>

          <div className="minor-project-extra minor-project-extra-stage-2">
            <ul className="mt-3 space-y-1 text-xs text-muted">
              {project.features.slice(0, 2).map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="minor-project-extra minor-project-extra-stage-3">
            <p className="mt-3 text-xs text-muted">{project.impact[0]}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
