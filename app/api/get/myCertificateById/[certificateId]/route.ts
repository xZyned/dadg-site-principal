import { NextRequest } from "next/server";
import { publicBackend } from "@/lib/public-backend";
export async function GET(request:NextRequest,{params}:{params:Promise<{certificateId:string}>}) {
 return publicBackend(`/api/v1/certificates/${encodeURIComponent((await params).certificateId)}/download`);
}
