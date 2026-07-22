import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "@/app/src/lib/auth0/Auth0Client";
import { applyBackendAuthentication, backendErrorStatus, fetchBackend } from "@/lib/backend";

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);
const RESPONSE_HEADERS = [
  "cache-control",
  "content-disposition",
  "content-type",
  "etag",
  "last-modified",
];

async function forwardRequest(request: NextRequest, { params }: RouteContext) {
  const { path } = await params;
  const targetPath = `/api/v1/${path.map(encodeURIComponent).join("/")}${request.nextUrl.search}`;
  const headers = new Headers();

  for (const name of ["accept", "content-type"]) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }

  const session = await auth0.getSession().catch(() => null);
  applyBackendAuthentication(headers, request, session);

  try {
    const upstream = await fetchBackend(targetPath, {
      method: request.method,
      headers,
      body: SAFE_METHODS.has(request.method) ? undefined : await request.arrayBuffer(),
      cache: "no-store",
    });

    const responseHeaders = new Headers();
    for (const name of RESPONSE_HEADERS) {
      const value = upstream.headers.get(name);
      if (value) responseHeaders.set(name, value);
    }

    return new Response(upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    const status = backendErrorStatus(error);
    return NextResponse.json(
      { error: status === 504 ? "Tempo limite do backend excedido" : "Erro ao conectar ao backend" },
      { status },
    );
  }
}

export const GET = forwardRequest;
export const HEAD = forwardRequest;
export const OPTIONS = forwardRequest;
export const POST = forwardRequest;
export const PUT = forwardRequest;
export const PATCH = forwardRequest;
export const DELETE = forwardRequest;
