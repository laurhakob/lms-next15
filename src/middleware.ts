import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  isAuthenticatedNextjs,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

const isPublicPage = createRouteMatcher(["/auth"]);
const isProtectedPage = createRouteMatcher(["/admin(.*)"]);
const isDashboardPage = createRouteMatcher(["/dashboard"]);

export default convexAuthNextjsMiddleware(async (request) => {
  const isAuthenticated = await isAuthenticatedNextjs();

  // Redirect unauthenticated users trying to access /admin routes to /auth
  if (isProtectedPage(request) && !isAuthenticated) {
    return nextjsMiddlewareRedirect(request, "/auth");
  }

  // Redirect authenticated users from /dashboard to /admin/dashboard
  if (isDashboardPage(request) && isAuthenticated) {
    return nextjsMiddlewareRedirect(request, "/admin/dashboard");
  }

  // Redirect authenticated users from /auth to /admin/dashboard
  if (isPublicPage(request) && isAuthenticated) {
    return nextjsMiddlewareRedirect(request, "/admin/dashboard");
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
