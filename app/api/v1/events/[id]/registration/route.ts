/**
 * Proxy server-side para inscrição/cancelamento em eventos.
 *
 * Por que existe isso?
 * O `accessToken` da sessão Auth0 fica em cookie HttpOnly — o browser não consegue
 * lê-lo. Este proxy roda no servidor Next.js, pega o token da sessão e o repassa
 * ao backend como Bearer, exatamente como o GateKeeper do backend espera.
 *
 * O POST agora também repassa ownerEmail e ownerCpf que o aluno informou no modal
 * de inscrição, necessários para a geração automática do certificado.
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

interface RouteParams {
  params: Promise<{ id: string }>;
}

// ----------------------------------------------------------------
// POST — Inscrever-se no evento (com CPF e email complementares)
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

  // Lê o body enviado pelo EventCard (ownerEmail, ownerCpf)
  let body: Record<string, string> = {};
  try {
    body = await req.json();
  } catch {
    // body pode vir vazio em algumas chamadas
  }

  try {
    const headers = new Headers({ "Content-Type": "application/json" });
    applyBackendAuthentication(headers, req, session);

    const backendRes = await fetchBackend(
      `/api/v1/events/${encodeURIComponent(id)}/registration`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          ownerEmail: body.ownerEmail || session.user.email || "",
          ownerCpf: body.ownerCpf || "",
        }),
        cache: "no-store",
      }
    );

    const data = await readBackendJson(backendRes);
    return NextResponse.json(data, { status: backendRes.status });
  } catch (err) {
    console.error(`[Proxy POST /api/v1/events/${id}/registration] Erro:`, err);
    const status = backendErrorStatus(err);
    return NextResponse.json(
      { error: status === 504 ? "Tempo limite do servidor excedido." : "Erro ao conectar ao servidor. Tente novamente mais tarde." },
      { status }
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
    const headers = new Headers({ "Content-Type": "application/json" });
    applyBackendAuthentication(headers, req, session);

    const backendRes = await fetchBackend(
      `/api/v1/events/${encodeURIComponent(id)}/registration`,
      {
        method: "DELETE",
        headers,
        cache: "no-store",
      }
    );

    const data = await readBackendJson(backendRes);
    return NextResponse.json(data, { status: backendRes.status });
  } catch (err) {
    console.error(`[Proxy DELETE /api/v1/events/${id}/registration] Erro:`, err);
    const status = backendErrorStatus(err);
    return NextResponse.json(
      { error: status === 504 ? "Tempo limite do servidor excedido." : "Erro ao conectar ao servidor. Tente novamente mais tarde." },
      { status }
    );
  }
}
