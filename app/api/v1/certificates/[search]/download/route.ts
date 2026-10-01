import { NextRequest } from "next/server";
import { publicBackend } from "@/lib/public-backend";
export async function GET(request: NextRequest, { params }: { params: Promise<{ search: string }> }) {
  const value = (await params).search;
  return publicBackend("/api/v1/certificates/" + encodeURIComponent(value) + "/download" + request.nextUrl.search);
}
