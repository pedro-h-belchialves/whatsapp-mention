import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const userPhone = request.cookies.get("userPhone")?.value;
  const isLoginPage = request.nextUrl.pathname === "/login";

  if (!userPhone && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (userPhone && isLoginPage) {
    return NextResponse.redirect(new URL("/audience", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/audience", "/mention", "/login"],
};
