import { Profile } from "@/types/portfolio";

export interface StackGroup {
  title: string;
  tools: string[];
}

export const profile: Profile = {
  name: "Bildad Mwangi Ng'ang'a",
  title: "Software Engineer | Flutter, React, Spring Boot, Node.js",
  tagline:
    "I design secure, production-grade systems that connect mobile apps, web dashboards, and backend services.",
  location: "Nairobi, Kenya",
  email: "ngangabildad@gmail.com",
  resumeHref: "/resume.pdf",
  socials: [
    { label: "GitHub", href: "https://github.com/gichigig" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/bildad-mwangi/" },
  ],
};

export const coreStrengths: string[] = [
  "Location-driven mobile features with practical geospatial ranking.",
  "Secure authentication stacks using passkeys, 2FA, OAuth, and role-based controls.",
  "Full lifecycle ownership across Flutter, React, Spring Boot, Node.js, and Electron.",
];

export const stackGroups: StackGroup[] = [
  {
    title: "Frontend",
    tools: ["Flutter", "React", "Next.js", "Vite", "Electron", "Tailwind CSS"],
  },
  {
    title: "Backend",
    tools: ["Spring Boot", "Node.js", "Express", "Supabase", "PostgreSQL"],
  },
  {
    title: "Realtime + Payments",
    tools: ["WebRTC", "M-Pesa STK Push", "Paystack", "SMS Integrations"],
  },
];

export const securityFocus: string[] = [
  "Passkey-first auth with fallback 2FA flows.",
  "Google sign-in and passwordless sign-in hardening.",
  "Verification workflows for trusted landlords and agents.",
  "Audit-friendly role boundaries for admin, managers, and operators.",
];
