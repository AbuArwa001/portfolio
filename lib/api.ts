// lib/api.ts
// Public data client for portfolio frontend

import {
  About,
  BlogPost,
  Project,
  SkillCategory,
  UserProfile,
  Me,
  Skill,
  Language,
  Certification,
} from "../types";

export const publicFetch = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
  const endpoint = url.startsWith("/api") ? url : `/api/v1${url.startsWith("/") ? url : `/${url}`}`;
  
  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json() as Promise<T>;
};

// Public API endpoints
export const api = {
  me: {
    get: (): Promise<Me> => publicFetch("/auth/me/"),
  },
  skills: {
    get: (): Promise<Skill[]> => publicFetch("/auth/profile/skills/"),
    getById: (id: number): Promise<Skill> => publicFetch(`/auth/profile/skills/${id}/`),
  },
  certifications: {
    get: (): Promise<Certification[]> => publicFetch("/certifications/"),
    getPublic: (): Promise<Certification[]> => publicFetch("/certifications/"),
    getById: (id: number): Promise<Certification> => publicFetch(`/certifications/${id}/`),
  },
  Languages: {
    get: (): Promise<Language[]> => publicFetch("/auth/profile/languages/"),
    getById: (id: number): Promise<Language> => publicFetch(`/auth/profile/languages/${id}/`),
  },
  skillCategory: {
    get: (): Promise<SkillCategory[]> => publicFetch("/auth/profile/skill-categories/"),
    getById: (id: number): Promise<SkillCategory> => publicFetch(`/auth/profile/skill-categories/${id}/`),
  },
  profile: {
    get: (): Promise<UserProfile> => publicFetch("/auth/profile/"),
  },
  about: {
    get: (): Promise<About> => publicFetch("/about/"),
  },
  projects: {
    get: (): Promise<Project[]> => publicFetch("/projects/"),
  },
  blog: {
    get: (): Promise<BlogPost[]> => publicFetch("/blog/"),
    getBySlug: (slug: string): Promise<BlogPost> => publicFetch(`/blog/?slug=${slug}`),
  },
  contact: {
    create: (data: { name: string; email: string; message: string }) =>
      publicFetch("/contact/", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },
};
