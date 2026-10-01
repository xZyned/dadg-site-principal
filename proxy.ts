import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "./app/src/lib/auth0/Auth0Client";
import { rateLimit } from "./lib/RateLimit";

const RATE_LIMIT = Number(process.env.RATE_LIMIT);
const hasRateLimit = Number.isSafeInteger(RATE_LIMIT) && RATE_LIMIT > 0;

export async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const isAuthRoute = pathname.startsWith("/auth/") || pathname.startsWith("/api/auth/");
  const isApiMutation = pathname.startsWith("/api/") && !["GET", "HEAD", "OPTIONS"].includes(req.method);

  if (isApiMutation && !isAuthRoute) {
    if (!hasRateLimit) return NextResponse.json({error:"Serviço de proteção temporariamente indisponível"},{status:503,headers:{"Cache-Control":"private, no-store"}});
    const requestOrigin = req.headers.get("origin");
    const allowedOrigins = new Set([
      req.nextUrl.origin.replace(/\/$/, ""),
      process.env.APP_BASE_URL?.replace(/\/$/, ""),
      process.env.SITE_URL?.replace(/\/$/, ""),
    ].filter((value): value is string => Boolean(value)));
    if (!requestOrigin || !allowedOrigins.has(requestOrigin.replace(/\/$/, ""))) {
      return NextResponse.json(
        { error: "Origem da requisição não autorizada.", code: "INVALID_REQUEST_ORIGIN" },
        { status: 403, headers: { "Cache-Control": "private, no-store" } },
      );
    }
    const isRegistrationRoute = /^\/api\/v1\/events\/.*\/registration/i.test(pathname);
    const limitToApply = isRegistrationRoute ? 3 : Number(RATE_LIMIT);
    const { canAccess, unavailable } = await rateLimit(req, limitToApply)

    if (unavailable && !canAccess) {
      return NextResponse.json(
        { error: "Serviço de proteção temporariamente indisponível" },
        { status: 503, headers: { "Cache-Control": "private, no-store" } },
      );
    }
    if (!canAccess) {
      return new Response("Too Many Requests", {
        status: 429,
        headers: { "Cache-Control": "private, no-store" },
      })
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
