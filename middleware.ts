import {
  clerkMiddleware,
  ClerkMiddlewareAuth,
  createRouteMatcher,
} from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/profile(.*)",
  "/events/create",
  "/events/:id/update",
]);
const isIgnoredRoute = createRouteMatcher([
  "/api/webhook/clerk",
  "/api/webhook/stripe",
  "/api/uploadthing",
]);

export default clerkMiddleware(
  (auth: ClerkMiddlewareAuth, req: NextRequest) => {
    if (isIgnoredRoute(req)) {
      return NextResponse.next();
    }

    if (isProtectedRoute(req)) {
      auth().protect();
    }

    return NextResponse.next();
  },
);

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
