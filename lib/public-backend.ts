import {headers} from "next/headers";
import {createHash,createHmac} from "node:crypto";
import { fetchBackend, backendErrorStatus } from "./backend";
export async function publicBackend(path: string) {
  try {
    const incoming=await headers();const forwarded=new Headers();
    const secret=process.env.PUBLIC_PROXY_RATE_LIMIT_SECRET;
    const ip=incoming.get("x-forwarded-for")?.split(",")[0]?.trim();
    if(secret&&ip){const key=createHash("sha256").update(ip).digest("hex"),time=String(Date.now());
      forwarded.set("x-dadg-client-key",key);forwarded.set("x-dadg-client-time",time);
      forwarded.set("x-dadg-client-signature",createHmac("sha256",secret).update(`${time}:${key}`).digest("hex"));}
    const upstream = await fetchBackend(path, { cache: "no-store",headers:forwarded });
    return new Response(upstream.body, {
      status: upstream.status,
      headers: {
        "Content-Type":
          upstream.headers.get("content-type") || "application/json",
        ...(upstream.headers.get("content-disposition")
          ? {
              "Content-Disposition": upstream.headers.get(
                "content-disposition",
              )!,
            }
          : {}),
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    return Response.json(
      { error: "Serviço temporariamente indisponível." },
      { status: backendErrorStatus(error) },
    );
  }
}
