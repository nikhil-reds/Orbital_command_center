import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE = "reds_session";

/**
 * Optimistic route protection for the workspace. API routes still validate the
 * signed session server-side before accessing data.
 */
export function proxy(request: NextRequest) {
  if (request.cookies.has(SESSION_COOKIE)) return NextResponse.next();

  if (request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const signInUrl = new URL("/signin", request.url);
  signInUrl.searchParams.set("next", `${request.nextUrl.pathname}${request.nextUrl.search}`);
  return NextResponse.redirect(signInUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/todo/:path*", "/api/users/:path*", "/api/tasks/:path*"],
};
