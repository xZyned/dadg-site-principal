import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default function AdminBlogLayout(): never {
  // A administração do blog está temporariamente desativada para todos.
  notFound();
}
