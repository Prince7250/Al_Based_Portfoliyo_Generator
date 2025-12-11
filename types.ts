export interface UserInput {
  fullName: string;
  currentRole: string;
  bioRaw: string;
  skillsRaw: string; // Comma separated
  experience: ExperienceInput[];
  projects: ProjectInput[];
  contactEmail: string;
  githubUrl?: string;
  linkedinUrl?: string;
  imageSize: '1K' | '2K' | '4K';
}

export interface ExperienceInput {
  id: string;
  company: string;
  role: string;
  duration: string;
  description: string;
}

export interface ProjectInput {
  id: string;
  title: string;
  techStack: string;
  description: string;
}

// The structure returned by Gemini
export interface GeneratedPortfolio {
  personalBrand: {
    tagline: string;
    professionalSummary: string;
    keyStrengths: string[];
  };
  skills: {
    category: string;
    items: string[];
  }[];
  experience: {
    company: string;
    role: string;
    duration: string;
    achievements: string[]; // AI enhanced bullets
  }[];
  projects: {
    title: string;
    description: string; // AI enhanced description
    techStack: string[];
    impact: string; // Generated "Impact" statement
  }[];
  contact: {
    ctaMessage: string;
  };
  heroImage?: string; // Base64 image
}

export enum AppState {
  INPUT = 'INPUT',
  GENERATING = 'GENERATING',
  PREVIEW = 'PREVIEW',
  ERROR = 'ERROR'
}