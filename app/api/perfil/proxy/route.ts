/**
 * Proxy interno do frontend para o backend.
 * 
 * Por que existe isso?
 * O frontend tem acesso ao cookie de sessão Auth0 (HttpOnly).
 * O cliente (browser) não pode acessar esse cookie diretamente.
 * Este proxy pega o accessToken da sessão e repassa ao backend como Bearer.
 */

import { NextResponse } from "next/server";
import { auth0 } from "@/app/src/lib/auth0/Auth0Client";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth0.getSession();
  if (!session?.user || !session.tokenSet?.accessToken) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  try {
    const backendRes = await fetch(`${BACKEND_URL}/api/v1/user/profile`, {
      headers: {
        Authorization: `Bearer ${session.tokenSet.accessToken}`,
        "Content-Type": "application/json",
        "X-User-Email": session.user.email || ""
      },
      cache: "no-store",
    });

    const data = await backendRes.json();
    return NextResponse.json({
      user: session.user,
      events: data.data || []
    }, { status: backendRes.status });
  } catch (err) {
    console.error("[Proxy /api/perfil/proxy] Erro:", err);
    return NextResponse.json({ error: "Erro ao conectar ao backend" }, { status: 502 });
  }
}
