import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "./app/src/lib/auth0/Auth0Client";
import { rateLimit } from "./lib/RateLimit";

const RATE_LIMIT = process.env.RATE_LIMIT

if (!RATE_LIMIT || isNaN(Number(RATE_LIMIT))) {
  throw new Error("RATE_LIMIT is not defined or is not a number in environment variables");
  // A ideia é crachar a aplicação logo na inicialização, para evitar que ela sem o Rate Limit
}

export async function proxy(req: NextRequest) {
  const session = await auth0.getSession()
  // Verificando o rate limit antes de qualquer outra coisa
  // Algumas rotas não precisam de proteção, porque são nativas Nextjs e iriam falsear o rate limit.
  const isStaticResource = /\/_next\/static|\/_next\/image|turbopack|favicon\.ico|\.(svg|png|jpg|jpeg|gif|webp|js|css|woff2?)$/i.test(req.nextUrl.pathname);
  if (!isStaticResource) {
    // DDoS protection para rotas sensíveis: Registration limite restrito a 3 requisições
    const isRegistrationRoute = /^\/api\/v1\/events\/.*\/registration/i.test(req.nextUrl.pathname);
    const limitToApply = isRegistrationRoute ? 3 : Number(RATE_LIMIT);
    
    // Como optamos para um valor estático de rateLimit para todos, tenho que tirar alguns arquivos fundamentais da aplicação
    // E isolar apenas a infraestrutura.
    const { canAccess } = await rateLimit(req, limitToApply)
    if (!canAccess) {
      return new Response("Too Many Requests", { status: 429 })
    }
  }
  if (req.nextUrl.pathname.startsWith("/panel")) {
    if (!session) {
      return NextResponse.redirect(new URL(`/auth/login?returnTo=${encodeURIComponent(req.nextUrl.pathname)}`, req.url));
    }
    return await auth0.middleware(req)
  }
  // Suporte ao fluxo de login/logout do Auth0 no frontend
  if (req.nextUrl.pathname.startsWith("/auth/") || req.nextUrl.pathname.startsWith("/api/auth/")) {
    return await auth0.middleware(req)
  }
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/:path*',
  ],
}