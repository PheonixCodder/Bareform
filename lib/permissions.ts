export const isBypassRoutes = [
  "/api/polar/webhook",
  "/api/inngest(.*)",
  "/api/login(.*)",
  "/api/signup(.*)",
  "/convex(.*)",
];

export const isPublicRoutes = ["/login", "/signup", "/"]

export const isProtectedRoutes = ["/dashboard(.*)"]