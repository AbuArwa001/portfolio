import { About, Project, BlogPost } from "@/types";

// lib/server-api.ts
export const serverFetch = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  const response = await fetch(`${process.env.API_BASE_URL}${url}`, {
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

// Server-side API endpoints with proper typing
export const serverApi = {
  about: {
    get: async (): Promise<About> => {
      const data = await serverFetch<{
        id: number;
        name: string;
        bio: string;
        profile_image?: string;
        skills?: string;
      }>("/about/");

      // Transform to match About type
      return {
        id: data.id,
        name: data.name,
        bio: data.bio,
        profile_image: data.profile_image || "",
        skills: data.skills || "",
      };
    },
  },
  projects: {
    get: async (): Promise<Project[]> => {
      const data = await serverFetch<
        Array<{
          id: number;
          title: string;
          description: string;
          link?: string;
          image?: string;
          created_at: string;
        }>
      >("/projects/");

      // Transform to match Project type
      return data.map((project) => ({
        id: project.id,
        title: project.title,
        description: project.description,
        link: project.link ?? undefined,
        image: project.image ?? undefined,
        created_at: project.created_at,
      }));
    },
  },
  blog: {
    get: async (): Promise<BlogPost[]> => {
      const data = await serverFetch<
        Array<{
          id: number;
          title: string;
          slug: string;
          content: string;
          created_at: string;
        }>
      >("/blog/");

      return data.map((post) => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        content: post.content,
        created_at: post.created_at,
      }));
    },
  },
};
