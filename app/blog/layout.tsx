import { notFound } from "next/navigation";
import { ReactNode } from "react";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";

export const dynamic = "force-dynamic";

export default async function BlogLayout({ children }: { children: ReactNode }) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/settings`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (data.blogEnabled === false) {
        notFound();
      }
    }
  } catch (err) {
    console.error("[BlogLayout] Erro ao verificar configurações do blog:", err);
  }

  return <>{children}</>;
}
