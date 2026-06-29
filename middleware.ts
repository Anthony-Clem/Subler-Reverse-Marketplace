import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isApiRoute = req.nextUrl.pathname.startsWith("/api");
  const isAuthApiRoute = req.nextUrl.pathname.startsWith("/api/auth");
  const isStripeWebhook = req.nextUrl.pathname === "/api/stripe/webhook";

  // Public GET endpoints for requests, excluding renter's own requests query
  const isPublicApiRoute =
    (req.nextUrl.pathname === "/api/requests" && req.method === "GET") ||
    (req.nextUrl.pathname.startsWith("/api/requests/") &&
      req.nextUrl.pathname !== "/api/requests/my" &&
      req.method === "GET");

  // Skip auth api endpoints and Stripe webhooks
  if (isAuthApiRoute || isStripeWebhook) return NextResponse.next();

  // If authenticated user tries to access /login, redirect to /dashboard
  if (isLoggedIn && req.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Protected application routes
  const isProtected =
    req.nextUrl.pathname.startsWith("/dashboard") ||
    req.nextUrl.pathname.startsWith("/requests") ||
    req.nextUrl.pathname.startsWith("/host") ||
    req.nextUrl.pathname.startsWith("/admin") ||
    req.nextUrl.pathname.startsWith("/settings") ||
    (isApiRoute && !isPublicApiRoute);

  if (isProtected && !isLoggedIn) {
    let callbackUrl = req.nextUrl.pathname;
    if (req.nextUrl.search) {
      callbackUrl += req.nextUrl.search;
    }
    const encodedCallbackUrl = encodeURIComponent(callbackUrl);
    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${encodedCallbackUrl}`, req.url)
    );
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
