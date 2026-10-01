export async function POST() {
  return Response.json({ error: "Operação disponível somente no painel administrativo.", code: "ADMIN_PORTAL_REQUIRED" }, { status: 410, headers: { "Cache-Control": "no-store" } });
}
