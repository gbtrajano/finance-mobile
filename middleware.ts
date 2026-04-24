// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get("auth_token");
  const { pathname } = request.nextUrl;

  // Debug: Se quiser ver no terminal se o middleware está rodando
  // console.log("Middleware visitando:", pathname);

  if (!authCookie && pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (authCookie && pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    // Adicione outras rotas que queira proteger aqui
  ],
};
