import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export const proxy = auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const role = (req.auth?.user as any)?.role;

  const isAuthRoute = nextUrl.pathname === "/login" || nextUrl.pathname === "/register";
  const isStudentRoute = nextUrl.pathname.startsWith("/dashboard");
  const isRecruiterRoute = nextUrl.pathname.startsWith("/recruiter");
  const isAdminRoute = nextUrl.pathname.startsWith("/admin");

  // Redirect logged-in users away from auth pages to their respective dashboard
  if (isAuthRoute) {
    if (isLoggedIn) {
      if (role === "STUDENT") return NextResponse.redirect(new URL("/dashboard", nextUrl));
      if (role === "RECRUITER") return NextResponse.redirect(new URL("/recruiter", nextUrl));
      if (role === "ADMIN") return NextResponse.redirect(new URL("/admin", nextUrl));
      return NextResponse.redirect(new URL("/", nextUrl));
    }
    return NextResponse.next();
  }

  // Guard protected routes
  if (isStudentRoute) {
    if (!isLoggedIn) return NextResponse.redirect(new URL("/login", nextUrl));
    if (role !== "STUDENT") return NextResponse.redirect(new URL("/", nextUrl));
  }

  if (isRecruiterRoute) {
    if (!isLoggedIn) return NextResponse.redirect(new URL("/login", nextUrl));
    if (role !== "RECRUITER") return NextResponse.redirect(new URL("/", nextUrl));
  }

  if (isAdminRoute) {
    if (!isLoggedIn) return NextResponse.redirect(new URL("/login", nextUrl));
    if (role !== "ADMIN") return NextResponse.redirect(new URL("/", nextUrl));
  }

  return NextResponse.next();
});

export default proxy;

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/recruiter/:path*",
    "/admin/:path*",
    "/login",
    "/register",
  ],
};
