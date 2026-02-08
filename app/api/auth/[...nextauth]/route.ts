// app/api/auth/[...nextauth]/route.ts
import NextAuth, { AuthOptions, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken?: string;
    refreshToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    accessToken?: string;
    refreshToken?: string;
  }
}

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Step 1: Get JWT tokens from Django
          const tokenResponse = await fetch(
            "http://localhost:8000/api/v1/auth/login/",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                username: credentials.email,
                password: credentials.password,
              }),
            }
          );

          if (!tokenResponse.ok) {
            console.error("Token request failed:", tokenResponse.status);
            return null;
          }

          const tokenData = await tokenResponse.json();

          // Step 2: Get user data using the access token
          const userResponse = await fetch(
            "http://localhost:8000/api/v1/auth/me/",
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${tokenData.access}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (!userResponse.ok) {
            console.error("User data request failed:", userResponse.status);
            return null;
          }

          const userData = await userResponse.json();

          // Explicitly type the returned user object to include custom fields
          return {
            id: userData.id.toString(),
            email: userData.email,
            name: `${userData.first_name || ""} ${
              userData.last_name || ""
            }`.trim(),
            accessToken: tokenData.access,
            refreshToken: tokenData.refresh,
          } as {
            id: string;
            email: string;
            name: string;
            accessToken: string;
            refreshToken: string;
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const customUser = user as typeof user & {
          id?: string;
          accessToken?: string;
          refreshToken?: string;
        };
        token.id = customUser.id;
        token.accessToken = customUser.accessToken;
        token.refreshToken = customUser.refreshToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.accessToken = token.accessToken as string;
        session.refreshToken = token.refreshToken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
