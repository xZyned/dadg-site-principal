import {NextRequest} from "next/server";
import {publicBackend} from "@/lib/public-backend";
export async function GET(request:NextRequest,{params}:{params:Promise<{id:string}>}){return publicBackend(`/api/v1/leagues/${encodeURIComponent((await params).id)}`);}
