"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { User } from "../types";
import {
  mapClerkUser,
  getUserDisplayName,
  getFirstEmail,
} from "../lib/clerk-utils";

interface AuthProps {
  children: (props: {
    isSignedIn: boolean;
    user: ReturnType<typeof mapClerkUser>;
    apiUser: User | null;
  }) => React.ReactNode;
}

export const Auth = ({ children }: AuthProps) => {
  const { isLoaded, isSignedIn, user: clerkUserRaw } = useUser();
  const [apiUser, setApiUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Map the raw Clerk user to our typed user
  const user = mapClerkUser(clerkUserRaw);

  useEffect(() => {
    const syncUserWithBackend = async () => {
      if (isSignedIn && user) {
        try {
          const token = await user.getToken();
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/me/`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.ok) {
            const userData: User = await response.json();
            setApiUser(userData);
          } else {
            console.error("Failed to fetch user data:", response.status);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    syncUserWithBackend();
  }, [isSignedIn, user]);

  if (!isLoaded || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  return children({ isSignedIn, user, apiUser });
};
