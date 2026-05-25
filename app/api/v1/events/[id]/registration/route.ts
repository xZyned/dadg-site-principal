/**
 * Proxy server-side para inscrição/cancelamento em eventos.
 *
 * Por que existe isso?
 * O `accessToken` da sessão Auth0 fica em cookie HttpOnly — o browser não consegue
 * lê-lo. Este proxy roda no servidor Next.js, pega o token da sessão e o repassa
 * ao backend como Bearer, exatamente como o GateKeeper do backend espera.
 *
 * Pattern idêntico ao de /api/perfil/proxy.
 */

import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "@/app/src/lib/auth0/Auth0Client";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// ----------------------------------------------------------------
// POST — Inscrever-se no evento
// ----------------------------------------------------------------
export async function POST(req: NextRequest, { params }: RouteParams) {
  const session = await auth0.getSession();

  if (!session?.user || !session.tokenSet?.accessToken) {
    return NextResponse.json(
      { error: "Não autenticado. Faça login para se inscrever." },
      { status: 401 }
    );
  }

  const { id } = await params;

  try {
    const backendRes = await fetch(
      `${BACKEND_URL}/api/v1/events/${id}/registration`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.tokenSet.accessToken}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (err) {
    console.error(`[Proxy POST /api/v1/events/${id}/registration] Erro:`, err);
    return NextResponse.json(
      { error: "Erro ao conectar ao servidor. Tente novamente mais tarde." },
      { status: 502 }
    );
  }
}

// ----------------------------------------------------------------
// DELETE — Cancelar inscrição no evento
// ----------------------------------------------------------------
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const session = await auth0.getSession();

  if (!session?.user || !session.tokenSet?.accessToken) {
    return NextResponse.json(
      { error: "Não autenticado. Faça login para cancelar a inscrição." },
      { status: 401 }
    );
  }

  const { id } = await params;

  try {
    const backendRes = await fetch(
      `${BACKEND_URL}/api/v1/events/${id}/registration`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.tokenSet.accessToken}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (err) {
    console.error(`[Proxy DELETE /api/v1/events/${id}/registration] Erro:`, err);
    return NextResponse.json(
      { error: "Erro ao conectar ao servidor. Tente novamente mais tarde." },
      { status: 502 }
    );
  }
}
