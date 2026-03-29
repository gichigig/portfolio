import type { ResumeData } from "@/types/resume";

export const resumeData: ResumeData = {
  contact: {
    name: "Bildad Mwangi Ng'ang'a",
    title: "Software Engineer",
    location: "Nairobi, Kenya",
    phone: "0768311755",
    email: "ngangabildad@gmail.com",
    github: "https://github.com/gichigig",
    linkedin: "https://www.linkedin.com/in/bildad-mwangi/",
  },
  summary:
    "Software Engineer focused on secure full-stack solutions across Flutter, React, Spring Boot, and Node.js. Experienced building mobile and web products with payment integrations, role-based dashboards, and production-oriented authentication flows.",
  skillGroups: [
    {
      label: "Languages & Frameworks",
      items: [
        "Java",
        "TypeScript/JavaScript",
        "Dart",
        "Python",
        "Flutter",
        "React",
        "Next.js",
        "Node.js",
        "Express",
        "Spring Boot",
      ],
    },
    {
      label: "Databases & Tools",
      items: [
        "PostgreSQL",
        "Supabase",
        "REST APIs",
        "Git",
        "Electron",
        "Tailwind CSS",
      ],
    },
    {
      label: "Security & Integrations",
      items: [
        "Passkeys",
        "2FA",
        "Google Sign-In/OAuth",
        "M-Pesa STK Push",
        "Paystack",
        "WebRTC",
      ],
    },
  ],
  experiences: [
    {
      role: "Software Engineering Attaché",
      company: "Context Expert Limited",
      period: "July 2025 - September 2025",
      bullets: [
        "Collaborated with engineers to deliver frontend and backend features for internal and client-facing applications.",
        "Diagnosed and resolved defects across web and mobile modules to improve release stability.",
        "Integrated REST API endpoints and authentication flows, including role-based behavior in application modules.",
        "Supported testing and deployment handoff by documenting fixes and validating stakeholder feedback.",
      ],
    },
  ],
  education: [
    {
      credential: "Diploma in Software Engineering",
      institution: "Zetech University",
      graduationYear: 2025,
    },
  ],
  projects: [
    {
      title: "Smart Rentals Platform",
      stack: "Flutter, Spring Boot, Next.js Admin",
      bullet:
        "Built location-aware rental discovery with ward filtering, nearest-listing ranking, and secure authentication.",
    },
    {
      title: "Hotel Operations Suite",
      stack: "React, Vite, Electron, M-Pesa, Paystack",
      bullet:
        "Developed multi-role hotel workflows for booking, payments, operations dashboards, and realtime communication.",
    },
    {
      title: "eLearning Campus Suite",
      stack: "Node.js, Express, Supabase",
      bullet:
        "Implemented dual student and staff portals with attendance, assessment, finance, and role-governed dashboards.",
    },
    {
      title: "Milk Record System",
      stack: "React, Vite, SMS Integration",
      bullet:
        "Created collector workflows for milk-record capture and farmer-facing SMS notifications.",
    },
    {
      title: "Church Contribution System",
      stack: "Web Dashboard, M-Pesa STK Push",
      bullet:
        "Delivered bulk and live-session contribution flows with admin management for organized giving campaigns.",
    },
  ],
};
