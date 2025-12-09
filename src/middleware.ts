// Temporarily disabled for demo purposes
// In production, enable this with proper Clerk configuration
// import { authMiddleware } from "@clerk/nextjs/server";

// export default authMiddleware({
//   publicRoutes: ["/", "/sign-in", "/sign-up"],
// });

// For demo purposes, export a simple middleware
export default function middleware() {
  // No-op middleware for demo
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};