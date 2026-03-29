export type ProjectTier = "flagship" | "minor";

export interface ProjectLink {
  label: "Case Study" | "Live Demo" | "GitHub" | "Docs";
  href: string;
}

export interface Project {
  slug: string;
  title: string;
  tier: ProjectTier;
  summary: string;
  stack: string[];
  features: string[];
  security: string[];
  impact: string[];
  links: ProjectLink[];
  problem: string;
  solution: string;
  architecture: string[];
}

export interface Profile {
  name: string;
  title: string;
  tagline: string;
  location: string;
  email: string;
  resumeHref: string;
  socials: { label: string; href: string }[];
}

export interface CommandResult {
  type: "info" | "success" | "error";
  text: string;
}
