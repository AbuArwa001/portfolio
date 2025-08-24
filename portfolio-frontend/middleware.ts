// middleware.ts
import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware(() => {
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Protect everything except static files and public routes
    "/((?!_next|favicon.ico|sign-in|sign-up|api/public).*)",
  ],
};
