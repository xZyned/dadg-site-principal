import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "./app/src/lib/auth0/Auth0Client";
import { rateLimit } from "./lib/RateLimit";

const RATE_LIMIT = process.env.RATE_LIMIT

if (!RATE_LIMIT || isNaN(Number(RATE_LIMIT))) {
  throw new Error("RATE_LIMIT is not defined or is not a number in environment variables");
  // A ideia é crachar a aplicação logo na inicialização, para evitar que ela sem o Rate Limit
}

export async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const isAuthRoute = pathname.startsWith("/auth/") || pathname.startsWith("/api/auth/");
  const isApiMutation = pathname.startsWith("/api/") && !["GET", "HEAD", "OPTIONS"].includes(req.method);

  if (isApiMutation && !isAuthRoute) {
    const isRegistrationRoute = /^\/api\/v1\/events\/.*\/registration/i.test(pathname);
    const limitToApply = isRegistrationRoute ? 3 : Number(RATE_LIMIT);
    const { canAccess, unavailable } = await rateLimit(req, limitToApply)

    if (unavailable && !canAccess) {
      return NextResponse.json({ error: "Serviço de proteção temporariamente indisponível" }, { status: 503 });
    }
    if (!canAccess) {
      return new Response("Too Many Requests", { status: 429 })
    }
  }

  if (pathname.startsWith("/panel")) {
    const session = await auth0.getSession()
    if (!session) {
      return NextResponse.redirect(new URL(`/auth/login?returnTo=${encodeURIComponent(pathname)}`, req.url));
    }
    return await auth0.middleware(req)
  }

  // Suporte ao fluxo de login/logout do Auth0 no frontend
  if (isAuthRoute) {
    return await auth0.middleware(req)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/panel/:path*',
    '/auth/:path*',
    '/api/:path*',
  ],
}
