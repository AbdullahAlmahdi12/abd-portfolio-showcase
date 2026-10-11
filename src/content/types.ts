export interface SiteImage { src: string; alt: string; source: string; contain?: boolean }
export interface SocialLink { label: string; href: string }
export interface Profile {
  name: string;
  tagline: string;
  photo: SiteImage & { darkSrc?: string };
  about: string[];
  now: string;
  location: string;
  languages: string;
  availability: string;
  available: boolean;
  email: string;
  emailLink: string;
  copyright: string;
  socials: SocialLink[];
}
export interface Project {
  slug: string;
  title: string;
  category: string;
  summary: string;
  description: string[];
  goal: string;
  stack: string;
  liveLink: string;
  repositoryLink?: string;
  originalLink?: string;
  cover: SiteImage;
  gallery: SiteImage[];
}
export interface WorkHistory {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  location: string;
  impacts: string[];
}
export interface Education {
  institution: string;
  degree: string;
  status: string;
  expectedGraduation: string;
}
export interface SiteContent {
  profile: Profile;
  projects: Project[];
  tools: { name: string; category: string }[];
  workHistory: WorkHistory[];
  education: Education[];
}

export interface ArabicContent {
  profile: Pick<Profile, "name" | "tagline" | "about" | "now" | "location" | "languages" | "availability" | "copyright"> & { photoAlt: string };
  tools: Record<string, string>;
  projects: Record<string, Pick<Project, "title" | "category" | "summary" | "description" | "goal">>;
  workHistory: Pick<WorkHistory, "company" | "role" | "endDate" | "location" | "impacts">[];
  education: Pick<Education, "institution" | "degree" | "status">[];
  imageAlts: Record<string, string>;
}
