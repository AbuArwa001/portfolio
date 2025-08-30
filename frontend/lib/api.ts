// lib/api.ts
// Simple fetch for public data - no authentication needed

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
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json() as Promise<T>;
};
export const authFetch = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_AUTH_BASE_URL}${url}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json() as Promise<T>;
};

// Public API endpoints (no authentication needed)
export const api = {
  me: {
    get: (): Promise<Me> => publicFetch("/me/"),
  },
  skills: {
    get: (): Promise<Skill[]> => authFetch("/profile/skills/"),
    getById: (id: number): Promise<Skill> =>
      authFetch(`/profile/skills/${id}/`),
    // add: (data: Skill) => authFetch("/profile/skills/", {
    //   method: "POST",
    //   body: JSON.stringify(data),
    // }),
    remove: (id: string) =>
      authFetch(`/profile/skills/${id}/`, {
        method: "DELETE",
      }),
  },
  certifications: {
    get: (): Promise<Certification[]> => authFetch("/profile/certifications/"),
    getById: (id: number): Promise<Certification> =>
      authFetch(`/profile/certifications/${id}/`),
    add: (data: Certification) =>
      authFetch("/profile/certifications/", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    remove: (id: string) =>
      authFetch(`/profile/certifications/${id}/`, {
        method: "DELETE",
      }),
  },
  Languages: {
    get: (): Promise<Language[]> => authFetch("/profile/languages/"),
    getById: (id: number): Promise<Language> =>
      authFetch(`/profile/languages/${id}/`),
    add: (data: Language) =>
      authFetch("/profile/languages/", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    remove: (id: string) =>
      authFetch(`/profile/languages/${id}/`, {
        method: "DELETE",
      }),
  },
  skillCategory: {
    get: (): Promise<SkillCategory[]> =>
      authFetch("/profile/skill-categories/"),
    getById: (id: number): Promise<SkillCategory> =>
      authFetch(`/profile/skill-categories/${id}/`),
  },
  profile: {
    get: (): Promise<UserProfile> => authFetch("/profile/"),
  },

  about: {
    get: (): Promise<About> => publicFetch("/about/"),
  },
  projects: {
    get: (): Promise<Project[]> => publicFetch("/projects/"),
  },
  blog: {
    get: (): Promise<BlogPost[]> => publicFetch("/blog/"),
    getBySlug: (slug: string): Promise<BlogPost> =>
      publicFetch(`/blog/?slug=${slug}`),
  },
  contact: {
    create: (data: { name: string; email: string; message: string }) =>
      publicFetch("/contact/", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },
};
