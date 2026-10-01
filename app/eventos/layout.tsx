import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Eventos e inscrições",
  alternates: { canonical: "/eventos" },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
