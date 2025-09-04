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
// lib/api.ts
const authFetchToken = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("authToken");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Use /api/django instead of /api/auth to avoid NextAuth.js conflict
  const response = await fetch(`/api/django${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`HTTP ${response.status} error for ${url}:`, errorText);
    throw new Error(
      `HTTP error! status: ${response.status}, message: ${errorText}`
    );
  }

  return response.json();
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
    create: async (data: Skill): Promise<Skill> => {
      const response = await fetch("/api/auth/profile/skills/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    delete: async (id: number): Promise<Skill> => {
      const response = await fetch(`/api/auth/profile/skills/${id}/`, {
        method: "DELETE",
      });
      return response.json();
    },
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
    create: async (data: Certification): Promise<Certification> => {
      const response = await fetch("/api/auth/profile/certifications/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    delete: async (id: number): Promise<Certification> => {
      const response = await fetch(`/api/auth/profile/certifications/${id}/`, {
        method: "DELETE",
      });
      return response.json();
    },
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
    update: async (data: UserProfile): Promise<UserProfile> => {
      return authFetchToken("/profile/update/", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
  },

  about: {
    get: (): Promise<About> => publicFetch("/about/"),
  },
  projects: {
    get: (): Promise<Project[]> => publicFetch("/projects/"),
    create: async (data: Project): Promise<Project> => {
      const response = await fetch("/api/projects/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    delete: async (id: number): Promise<Project> => {
      const response = await fetch(`/api/projects/${id}/`, {
        method: "DELETE",
      });
      return response.json();
    },
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
