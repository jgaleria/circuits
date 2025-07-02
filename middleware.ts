import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Check for token in cookies
  const token = request.cookies.get('access_token')?.value;
  const isLoggedIn = !!token;

  // Allow unauthenticated access to password reset and auth pages
  const publicPaths = [
    "/",
    "/auth/login",
    "/auth/sign-up",
    "/auth/forgot-password",
    "/auth/update-password",
    "/auth/sign-up-success"
  ];
  if (
    publicPaths.includes(request.nextUrl.pathname) ||
    request.nextUrl.pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  // Redirect unauthenticated users to login
  if (!isLoggedIn) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
