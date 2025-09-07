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
import { getSession } from "next-auth/react";

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

const authFetchToken = async (url: string, options: RequestInit = {}) => {
  try {
    const session = await getSession();
    let token = session?.accessToken;

    // Check if token is expired
    if (token && isTokenExpired(token)) {
      console.log("Token expired, attempting refresh...");
      const newSession = await refreshToken();
      token = newSession?.accessToken;
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_AUTH_BASE_URL}${url}`,
      {
        ...options,
        headers,
      }
    );

    // If still unauthorized after refresh, throw error
    if (response.status === 401) {
      throw new Error("Authentication failed after token refresh");
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`HTTP ${response.status} error for ${url}:`, errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    return response.json();
  } catch (error) {
    console.error(`Fetch error for ${url}:`, error);
    throw error;
  }
};

// Helper function to check if token is expired
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const exp = payload.exp * 1000; // Convert to milliseconds
    return Date.now() >= exp;
  } catch {
    return true;
  }
}

const authFetchFormData = async (
  url: string,
  options: RequestInit = {}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> => {
  try {
    const session = await getSession();
    let token = session?.accessToken;

    // Check if token is expired
    if (token && isTokenExpired(token)) {
      console.log("Token expired, attempting refresh...");
      const newSession = await refreshToken();
      token = newSession?.accessToken;
    }

    const headers: Record<string, string> = {
      // Don't set Content-Type for FormData - browser will set it with boundary
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_AUTH_BASE_URL}${url}`,
      {
        ...options,
        headers,
      }
    );

    // If still unauthorized after refresh, throw error
    if (response.status === 401) {
      throw new Error("Authentication failed after token refresh");
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`HTTP ${response.status} error for ${url}:`, errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    return response.json();
  } catch (error) {
    console.error(`Fetch error for ${url}:`, error);
    throw error;
  }
};

// Then update uploadProfileImage to use authFetchFormData
export const uploadProfileImage = async (
  formData: FormData
): Promise<{ imageUrl: string }> => {
  return authFetchFormData("/profile/upload-image/", {
    method: "POST",
    body: formData,
  });
};
// Function to refresh token
async function refreshToken() {
  try {
    const session = await getSession();
    const refreshToken = session?.refreshToken;

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_AUTH_BASE_URL}/token/refresh/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: refreshToken }),
      }
    );

    if (!response.ok) {
      throw new Error("Token refresh failed");
    }

    const data = await response.json();

    // Update the session with new tokens
    // This depends on how you handle sessions in your app
    // You might need to use signIn() or update() from next-auth

    return {
      accessToken: data.access,
      refreshToken: refreshToken,
    };
  } catch (error) {
    console.error("Token refresh failed:", error);
    // Redirect to login or handle authentication failure
    window.location.href = "/auth/login";
    throw error;
  }
}

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
  // lib/api.ts
  profile: {
    get: (): Promise<UserProfile> => authFetchToken("/profile/"),
    update: async (data: Partial<UserProfile>): Promise<UserProfile> => {
      return authFetchToken("/profile/update/", {
        method: "PATCH",
        body: JSON.stringify(data),
      });
    },
    uploadImage: uploadProfileImage,
  },
  about: {
    get: (): Promise<About> => publicFetch("/about/"),
  },
  projects: {
    get: (): Promise<Project[]> => publicFetch("/api/projects/"),
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
