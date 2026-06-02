



// ============================================================

// Interfaces tell TypeScript the shape of each data type.
// This fixes ALL "implicit any" errors in map/filter callbacks.
export interface Skill         { name: string; level: number; category: string; }
export interface Qualification { degree: string; school: string; year: string; description: string; }
export interface Project       { title: string; description: string; tech: string[]; image: string | null; link: string; featured: boolean; }
export interface NavItem       { id: string; label: string; emoji: string; }


// ─────────────────────────────────────────────
// HOW TO ADD YOUR PHOTO:
//   1. Copy your photo to the "public" folder → public/me.jpg
//   2. Change  avatar: null
//      to      avatar: "/me.jpg"
// ─────────────────────────────────────────────
export const PROFILE = {
  name:     "BATEMI STUART HEDDI",
  title:    "EASTC/BDTS/24/01102",
  subtitle: "DATA SCIENCE STUDENT",
  bio:      " A data science student and experienced system analyst passionate about leveraging advanced analytics to solve real-world problems. I believe the future of global progress lies in creating intelligent, sustainable systems that drive efficiency, financial inclusion, and smarter infrastructure for everyone.",
  email:    "heddibatemi@yahoo.com",
  github:   "https://github.com/stuartbatemi",
  linkedin: "https://www.linkedin.com/in/stuartbatemi55",
  location: "Dar es Salaam, Tanzania",
  avatar: "/images/mema.jpeg",   // ← change to "/me.jpg" when ready
};

export const SKILLS: Skill[] = [
  { name: "HTML & CSS",   level: 4, category: "Frontend" },
  { name: "JavaScript",   level: 3, category: "Frontend" },
  { name: "React",        level: 3, category: "Frontend" },
  { name: "Node.js",      level: 2, category: "Backend"  },
  { name: "Express.js",   level: 2, category: "Backend"  },
  { name: "REST APIs",    level: 3, category: "Backend"  },
  { name: "Git & GitHub", level: 3, category: "Tools"    },
  { name: "TypeScript",   level: 2, category: "Tools"    },
  { name: "Vercel",       level: 2, category: "Cloud"    },
  { name: "Render",       level: 2, category: "Cloud"    },
];

export const QUALIFICATIONS: Qualification[] = [
  {
    degree:      "BSc in Data Science",
    school:      "EASTERN AFRICA STATISTICAL TRAINING CENTRE",
    year:        "2023 – Present",
    description: "Studying cloud infrastructure, web development, and software engineering.",
  },
  {
    degree:      "Certificate: Web Development Basics",
    school:      "Online / Self-study",
    year:        "2023",
    description: "Completed courses covering HTML, CSS, JavaScript, and responsive design.",
  },
];

export const PROJECTS: Project[] = [
  {
    title:       "Credit Card Fraud Detection",
    description: "The project addresses the challenge of identifying fraudulent credit card transactions in a highly unbalanced dataset (0.17% fraud). The built machine learning pipeline prioritizes catching thieves over simply achieving high accuracy.",
    tech:        ["python", "Jupyter Notebook"],
    image:  "/images/projectx.jpg",   // ← change to "/project1.png" when ready
    link:        "#",     // ← update with your Vercel URL after deploy
    featured:    true,
  },
  {
    title:       "Portfolio REST API",
    description: "Node.js/Express backend serving portfolio data as JSON. Deployed on Render.",
    tech:        ["Node.js", "Express", "REST API", "Render"],
    image: "/images/project2.jpg",    // ← change to "/project2.png" when ready
    link:        "#",     // ← update with your Render URL after deploy
    featured:    true,
  },
];

export const CATEGORY_COLORS: Record<string, string> = {
  Frontend: "#818cf8",
  Backend:  "#34d399",
  Tools:    "#f59e0b",
  Cloud:    "#38bdf8",
};

export const NAV_ITEMS: NavItem[] = [
  { id: "profile",        label: "Profile",   emoji: "◈" },
  { id: "skills",         label: "Skills",    emoji: "◎" },
  { id: "qualifications", label: "Education", emoji: "◇" },
  { id: "projects",       label: "Projects",  emoji: "◉" },
  { id: "contact",        label: "Contact",   emoji: "✦" },
];
