import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
          const res = await fetch(`${API_URL}/api/v1/auth/login/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username: credentials.email, // DRF TokenObtainPairView usually expects 'username' by default, which can be an email depending on custom user model setup
              password: credentials.password,
            }),
          });

          const data = await res.json();

          if (res.ok && data.access) {
            // Return user object, storing the tokens
            return {
              id: "1", // we don't necessarily get id from token payload directly without decoding
              email: credentials.email,
              name: "Admin User", // We might not get the name from the token payload, set a default
              access: data.access,
              refresh: data.refresh,
            };
          }
          
          // If login failed
          return null;
        } catch (e) {
          console.error("DRF Login error:", e);
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // user object is only passed on initial login
        token.id = user.id;
        token.access = (user as any).access;
        token.refresh = (user as any).refresh;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        if (session.user) {
           session.user.id = token.id as string;
        }
        // Expose token to session so client can use it for DRF API calls
        (session as any).accessToken = token.access;
      }
      return session;
    },
  },
};
