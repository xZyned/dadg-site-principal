import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "@/app/src/lib/auth0/Auth0Client";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000";

export const dynamic = "force-dynamic";

async function proxyRequest(req: NextRequest, params: { slug: string[] }) {
  const { slug } = await params;
  const path = slug.join("/");
  
  // O backend deve estar em /api/v1/blog/path
  const targetUrl = new URL(`${BACKEND_URL}/api/v1/blog/${path}`);
  
  // Repassa a query string
  req.nextUrl.searchParams.forEach((value, key) => {
    targetUrl.searchParams.append(key, value);
  });

  const headers = new Headers();
  headers.set("Content-Type", "application/json");

  // Se houver sessão (usuário logado), envia a autenticação
  const session = await auth0.getSession();
  if (session?.user) {
    if (session.user.email) {
      headers.set("X-User-Email", session.user.email);
    }
    const token = session.tokenSet?.accessToken;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const options: RequestInit = {
    method: req.method,
    headers,
    cache: "no-store",
  };

  // Se tiver corpo (POST, PUT, etc)
  if (req.method !== "GET" && req.method !== "HEAD") {
    try {
      const body = await req.text();
      if (body) options.body = body;
    } catch (e) {
      // Body vazio
    }
  }

  try {
    const backendRes = await fetch(targetUrl.toString(), options);
    
    // Ler o body em texto primeiro
    const responseText = await backendRes.text();
    let responseData;
    try {
      responseData = responseText ? JSON.parse(responseText) : {};
    } catch {
      responseData = { message: responseText };
    }

    return NextResponse.json(responseData, { status: backendRes.status });
  } catch (err) {
    console.error(`[Proxy Blog /api/v1/blog/proxy/${path}] Erro:`, err);
    return NextResponse.json({ error: "Erro ao conectar ao backend" }, { status: 502 });
  }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string[] }> }) {
  return proxyRequest(req, await params);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string[] }> }) {
  return proxyRequest(req, await params);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string[] }> }) {
  return proxyRequest(req, await params);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ slug: string[] }> }) {
  return proxyRequest(req, await params);
}
