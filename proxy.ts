import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "./app/src/lib/auth0/Auth0Client";


export async function proxy(req: NextRequest) {
  const session = await auth0.getSession()
  if (req.nextUrl.pathname.startsWith("/panel")) {
    if (!session) {
      return await auth0.startInteractiveLogin({ returnTo: req.nextUrl.toString() })
    }
    return await auth0.middleware(req)
  }
  if (req.nextUrl.pathname.startsWith("/auth/")) {
    return await auth0.middleware(req)
  }
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/:path*',
  ],
}