import {NextRequest} from "next/server";
import {publicBackend} from "@/lib/public-backend";
export async function GET(request:NextRequest,{params}:{params:Promise<{id:string}>}){return publicBackend(`/api/v1/events/${encodeURIComponent((await params).id)}`);}
