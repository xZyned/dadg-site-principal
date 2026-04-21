import type { Metadata } from "next";
import { UserProvider } from "@/lib/userProvider";
import "./globals.css";
import MenuDrawer from "./components/MenuDrawer";
import { auth0 } from "@/app/src/lib/auth0/Auth0Client"
export const metadata: Metadata = {
  title: "@dadg.imepac",
  description: "Bem vindo(a) ao site do Dadg Imepac Araguari!",
  icons: {
    icon: "/logoDadg02.ico"
  }
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth0.getSession()
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        {/* Componente Client que contém a interatividade */}
        <MenuDrawer />
        {/* Conteúdo Principal com padding para evitar sobreposição do header */}
        <div className="main-content">
          <UserProvider tokenVar={session?.tokenSet.idToken || undefined}>
            {children}
          </UserProvider>
        </div>
      </body>
    </html>
  );
}
