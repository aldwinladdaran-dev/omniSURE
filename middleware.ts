import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    const { protect } = await auth();
    protect();
  }
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)", "/", "/(api|trpc)(.*)"],
};
