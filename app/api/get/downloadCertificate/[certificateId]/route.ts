import { NextRequest } from "next/server";
import { publicBackend } from "@/lib/public-backend";
export async function GET(_request:NextRequest,{params}:{params:Promise<{certificateId:string}>}){return publicBackend(`/api/public/certificates/${encodeURIComponent((await params).certificateId)}/pdf`);}
