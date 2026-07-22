import "server-only";
import type { NextRequest } from "next/server";

type BackendSession = {
  user?: { email?: string | null } | null;
  tokenSet?: { accessToken?: string | null } | null;
} | null;

export const BACKEND_URL = (process.env.BACKEND_URL || "http://localhost:3000").replace(/\/$/, "");
export const BACKEND_TIMEOUT_MS = 10_000;

export class BackendTimeoutError extends Error {
  constructor() {
    super("Backend request timed out");
    this.name = "BackendTimeoutError";
  }
}

function isAuth0SessionCookie(name: string) {
  return (
    name === "__session" ||
    name.startsWith("__session__") ||
    name.startsWith("__session.") ||
    name === "appSession" ||
    name.startsWith("appSession.")
  );
}

export function applyBackendAuthentication(
  headers: Headers,
  request: NextRequest,
  session: BackendSession,
) {
  const accessToken = session?.tokenSet?.accessToken;

  if (process.env.AUTH0_AUDIENCE && accessToken) {
    headers.set("authorization", `Bearer ${accessToken}`);
  } else {
    const sessionCookie = request.cookies
      .getAll()
      .filter(({ name }) => isAuth0SessionCookie(name))
      .map(({ name, value }) => `${name}=${value}`)
      .join("; ");

    if (sessionCookie) headers.set("cookie", sessionCookie);
  }

  if (session?.user?.email) {
    headers.set("x-user-email", session.user.email);
  }
}

export async function fetchBackend(
  path: string,
  init: RequestInit = {},
  timeoutMs = BACKEND_TIMEOUT_MS,
) {
  const timeoutSignal = AbortSignal.timeout(timeoutMs);

  try {
    return await fetch(`${BACKEND_URL}${path.startsWith("/") ? path : `/${path}`}`, {
      ...init,
      signal: init.signal || timeoutSignal,
    });
  } catch (error) {
    if (
      timeoutSignal.aborted ||
      (error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError"))
    ) {
      throw new BackendTimeoutError();
    }
    throw error;
  }
}

export async function readBackendJson(response: Response): Promise<Record<string, unknown>> {
  const text = await response.text();
  if (!text) return {};

  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    return { error: text };
  }
}

export function backendErrorStatus(error: unknown) {
  return error instanceof BackendTimeoutError ? 504 : 502;
}
