export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/dashboard", "/profile"], // protect specific routes
  // or use: matcher: ["/((?!api|auth|_next/static|_next/image|favicon.ico).*)"]
};
