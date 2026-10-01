import {publicBackend} from "@/lib/public-backend";
export async function GET(){return publicBackend("/api/v1/leagues");}
