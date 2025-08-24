import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Debug - middelwer nie chciał startować.
  //console.log("MIDDLEWARE URUCHOMIONY DLA ŚCIEŻKI:", request.nextUrl.pathname);

  const cookie = request.cookies.get("auth-token");
  if (!cookie) {
    // Mockupowanie Ciastka aby walidacja działała
    const authToken = JSON.stringify({
      tenantId: "t-123",
      user: { id: "u-456", email: "alice@example.com" },
    });
    const response = NextResponse.next();
    response.cookies.set("auth-token", authToken, {
      httpOnly: true,
      path: "/",
    });
    return response;
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};
