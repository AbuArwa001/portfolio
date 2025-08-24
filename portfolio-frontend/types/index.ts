export interface About {
  id?: number;
  name: string;
  bio: string;
  profile_image?: string | null;
  skills?: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  link?: string | null;
  image?: string | null;
  created_at?: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  created_at?: string;
}

export interface ContactMessage {
  id?: number;
  name: string;
  email: string;
  message: string;
  created_at?: string;
}

export interface User {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  profile_image?: string;
}
