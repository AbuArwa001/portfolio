import { ClerkUser, ClerkEmailAddress } from "../types/clerk";

type RawLinkedTo = {
  id?: string;
  type?: string;
};

type RawEmail = {
  id?: string;
  emailAddress?: string;
  verification?: {
    status?: string;
    strategy?: string;
  };
  linkedTo?: RawLinkedTo[];
};

type RawClerkUser = {
  id?: string;
  firstName?: string | null;
  lastName?: string | null;
  username?: string | null;
  imageUrl?: string | null;
  emailAddresses?: RawEmail[];
  primaryEmailAddressId?: string | null;
  getToken?: (...args: unknown[]) => Promise<string>;
};

// Safe default values for ClerkUser
const DEFAULT_CLERK_USER: ClerkUser = {
  id: "",
  firstName: null,
  lastName: null,
  username: null,
  imageUrl: "",
  emailAddresses: [],
  primaryEmailAddressId: null,
  getToken: () => Promise.resolve(""),
};

// Safe default values for ClerkEmailAddress
const DEFAULT_EMAIL: ClerkEmailAddress = {
  id: "",
  emailAddress: "",
  verification: {
    status: "",
    strategy: "",
  },
  linkedTo: [],
};

export const mapClerkUser = (
  user: RawClerkUser | null | undefined
): ClerkUser | null => {
  if (!user) return null;

  // Create a safe user object with defaults
  const safeUser: ClerkUser = {
    ...DEFAULT_CLERK_USER,
    id: user.id ?? DEFAULT_CLERK_USER.id,
    firstName: user.firstName ?? DEFAULT_CLERK_USER.firstName,
    lastName: user.lastName ?? DEFAULT_CLERK_USER.lastName,
    username: user.username ?? DEFAULT_CLERK_USER.username,
    imageUrl: user.imageUrl ?? DEFAULT_CLERK_USER.imageUrl,
    primaryEmailAddressId:
      user.primaryEmailAddressId ?? DEFAULT_CLERK_USER.primaryEmailAddressId,
    getToken: user.getToken?.bind(user) ?? DEFAULT_CLERK_USER.getToken,
  };

  // Safely map email addresses
  if (user.emailAddresses && Array.isArray(user.emailAddresses)) {
    safeUser.emailAddresses = user.emailAddresses.map((email: RawEmail) => ({
      ...DEFAULT_EMAIL,
      id: email.id ?? DEFAULT_EMAIL.id,
      emailAddress: email.emailAddress ?? DEFAULT_EMAIL.emailAddress,
      verification: {
        status: email.verification?.status ?? DEFAULT_EMAIL.verification.status,
        strategy:
          email.verification?.strategy ?? DEFAULT_EMAIL.verification.strategy,
      },
      linkedTo:
        email.linkedTo?.map((link: RawLinkedTo) => ({
          id: link.id ?? "",
          type: link.type ?? "",
        })) ?? DEFAULT_EMAIL.linkedTo,
    }));
  }

  return safeUser;
};

export const getPrimaryEmail = (user: ClerkUser | null): string => {
  if (!user) return "";

  const primaryEmail = user.emailAddresses.find(
    (email) => email.id === user.primaryEmailAddressId
  );

  return (
    primaryEmail?.emailAddress || user.emailAddresses[0]?.emailAddress || ""
  );
};

// Helper function to safely access user properties
export const getUserDisplayName = (user: ClerkUser | null): string => {
  if (!user) return "User";

  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }

  if (user.firstName) {
    return user.firstName;
  }

  if (user.username) {
    return user.username;
  }

  return "User";
};

// Helper function to safely get the first email
export const getFirstEmail = (user: ClerkUser | null): string => {
  if (!user || user.emailAddresses.length === 0) return "";
  return user.emailAddresses[0]?.emailAddress || "";
};
