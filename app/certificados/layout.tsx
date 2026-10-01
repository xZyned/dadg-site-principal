import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Certificados",
  alternates: { canonical: "/certificados" },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
