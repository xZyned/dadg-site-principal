import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Ouvidoria",
  alternates: { canonical: "/ouvidoria" },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
