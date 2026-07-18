import { notFound } from "next/navigation";
import { ReactNode } from "react";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000";

export const dynamic = "force-dynamic";

export default async function AdminBlogLayout({ children }: { children: ReactNode }) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/settings`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (data.blogEnabled === false) {
        notFound();
      }
    }
  } catch (err) {
    console.error("[AdminBlogLayout] Erro ao verificar configurações do blog:", err);
  }

  return <>{children}</>;
}
