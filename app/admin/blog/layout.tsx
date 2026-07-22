import { notFound } from "next/navigation";
import { ReactNode } from "react";
import { getSiteSettings } from "@/lib/siteSettings";

export const dynamic = "force-dynamic";

export default async function AdminBlogLayout({ children }: { children: ReactNode }) {
  const { blogEnabled } = await getSiteSettings();
  if (!blogEnabled) notFound();

  return <>{children}</>;
}
