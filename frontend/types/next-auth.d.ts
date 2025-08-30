import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  // interface Session {
  //   user: {
  //     id: string;
  //     email: string;
  //     name?: string | null;
  //   };
  //   accessToken?: string;
  // }
  interface Session {
    user: User;
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    accessToken?: string;
  }
}
