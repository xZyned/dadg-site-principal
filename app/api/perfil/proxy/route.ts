/**
 * Proxy interno do frontend para o backend.
 * 
 * Por que existe isso?
 * O frontend tem acesso ao cookie de sessão Auth0 (HttpOnly).
 * O cliente (browser) não pode acessar esse cookie diretamente.
 * Este proxy pega o accessToken da sessão e repassa ao backend como Bearer.
 */

import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "@/app/src/lib/auth0/Auth0Client";
import {
  applyBackendAuthentication,
  backendErrorStatus,
  fetchBackend,
  readBackendJson,
} from "@/lib/backend";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const session = await auth0.getSession();
  if (!session?.user || !session.tokenSet?.accessToken) {
    return NextResponse.json(
      { error: "Não autenticado", code: "NOT_AUTHENTICATED" },
      { status: 401 },
    );
  }

  try {
    const headers = new Headers({ "Content-Type": "application/json" });
    applyBackendAuthentication(headers, request, session);

    const backendRes = await fetchBackend("/api/v1/user/profile", {
      headers,
      cache: "no-store",
    });

    const data = await readBackendJson(backendRes);
    if (!backendRes.ok) {
      return NextResponse.json(
        {
          error: data.error || data.message || "Erro retornado pelo backend",
          code: [401, 403].includes(backendRes.status) ? "BACKEND_AUTH_REJECTED" : "BACKEND_ERROR",
        },
        { status: backendRes.status },
      );
    }

    return NextResponse.json({
      user: session.user,
      events: Array.isArray(data.data) ? data.data : [],
    });
  } catch (err) {
    console.error("[Proxy /api/perfil/proxy] Erro:", err);
    const status = backendErrorStatus(err);
    return NextResponse.json(
      { error: status === 504 ? "Tempo limite do backend excedido" : "Erro ao conectar ao backend" },
      { status },
    );
  }
}
