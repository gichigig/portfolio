export interface ResumeContact {
  name: string;
  title: string;
  location: string;
  phone: string;
  email: string;
  github: string;
  linkedin: string;
}

export interface ResumeSkillGroup {
  label: string;
  items: string[];
}

export interface ResumeExperience {
  role: string;
  company: string;
  period: string;
  bullets: string[];
}

export interface ResumeEducation {
  credential: string;
  institution: string;
  graduationYear: number;
}

export interface ResumeProject {
  title: string;
  stack: string;
  bullet: string;
}

export interface ResumeData {
  contact: ResumeContact;
  summary: string;
  skillGroups: ResumeSkillGroup[];
  experiences: ResumeExperience[];
  education: ResumeEducation[];
  projects: ResumeProject[];
}
