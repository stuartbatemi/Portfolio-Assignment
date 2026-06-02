// ============================================================
// api.ts — fetches live data from your Render backend
// Falls back to static data if the API is offline/sleeping
// ============================================================

import {
  PROFILE as STATIC_PROFILE,
  SKILLS as STATIC_SKILLS,
  PROJECTS as STATIC_PROJECTS,
  QUALIFICATIONS as STATIC_QUALIFICATIONS,
} from "./portfolio";

import type { Skill, Qualification, Project } from "./portfolio";

const BASE_URL = "https://portfolio-backend-fu0u.onrender.com";

// Helper — fetch with a timeout so we don't wait forever
// Render free tier can take ~15s to wake up
async function fetchWithFallback<T>(endpoint: string, fallback: T): Promise<T> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000); // 8s timeout

    const res = await fetch(`${BASE_URL}${endpoint}`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch {
    console.warn(`[API] ${endpoint} failed — using static fallback`);
    return fallback;
  }
}

// ── Individual fetchers ──────────────────────────────────────

export async function fetchProfile() {
  return fetchWithFallback("/profile", STATIC_PROFILE);
}

export async function fetchSkills(): Promise<Skill[]> {
  return fetchWithFallback("/skills", STATIC_SKILLS);
}

export async function fetchProjects(): Promise<Project[]> {
  const data = await fetchWithFallback("/projects", STATIC_PROJECTS);
  // Backend doesn't return images — merge with static image paths
  return data.map((p: Project, i: number) => ({
    ...p,
    image: STATIC_PROJECTS[i]?.image ?? null,
  }));
}

export async function fetchQualifications(): Promise<Qualification[]> {
  return fetchWithFallback("/qualifications", STATIC_QUALIFICATIONS);
}

// ── Fetch everything at once ─────────────────────────────────
export async function fetchAllPortfolioData() {
  const [profile, skills, projects, qualifications] = await Promise.all([
    fetchProfile(),
    fetchSkills(),
    fetchProjects(),
    fetchQualifications(),
  ]);
  return { profile, skills, projects, qualifications };
}