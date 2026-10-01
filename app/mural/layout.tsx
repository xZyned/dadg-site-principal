import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Avisos e comunicados",
  alternates: { canonical: "/mural" },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
