import type { ReactNode } from "react";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { UserProvider } from "@/lib/userProvider";
import { auth0 } from "@/app/src/lib/auth0/Auth0Client";
import SiteShell from "@/app/components/site-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: "@dadg.imepac",
  description: "Portal oficial do Diretório Acadêmico Diogo Guimarães do Imepac Araguari.",
  icons: {
    icon: "/logoDadg02.ico",
  },
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const session = await auth0.getSession();
  const theme = cookieStore.get("dadg-theme")?.value === "dark" ? "dark" : "light";

  return (
    <html
      lang="pt-BR"
      className={theme === "dark" ? "dark" : undefined}
      style={{ colorScheme: theme }}
      suppressHydrationWarning
    >
      <body className="antialiased">
        <UserProvider tokenVar={session?.tokenSet.idToken || undefined}>
          <SiteShell>{children}</SiteShell>
        </UserProvider>
      </body>
    </html>
  );
}
