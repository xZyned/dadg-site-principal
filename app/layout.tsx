import type { ReactNode } from "react";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { UserProvider } from "@/lib/userProvider";
import { auth0 } from "@/app/src/lib/auth0/Auth0Client";


import "./globals.css";

import MenuDrawer from "./components/MenuDrawer";
import MobileBottomNav from "./components/MobileBottomNav";
import Footer from "./components/Footer";
import UpcomingSchedulePopup from "./components/UpcomingSchedulePopup";
import { getSiteSettings } from "@/lib/siteSettings";
import { Inter, Playfair_Display } from "next/font/google";
import { ThemeProvider } from "./components/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const SITE_URL = "https://www.dadg.com.br";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "DADG IMEPAC | Diretório Acadêmico Diogo Guimarães",
    template: "%s | DADG IMEPAC",
  },
  description:
    "O Diretório Acadêmico Diogo Guimarães é a representação oficial dos estudantes de Medicina da IMEPAC Araguari. Coordenadorias, eventos, certificados e liderança estudantil em um só lugar.",
  keywords: [
    "DADG",
    "IMEPAC",
    "Diretório Acadêmico",
    "Medicina Araguari",
    "Estudantes de Medicina",
    "Diogo Guimarães",
    "CAEP",
    "CAES",
    "CLAM",
    "CLEV",
    "CAC",
  ],
  icons: { icon: "/favicon_blue.png" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: SITE_URL,
    siteName: "DADG IMEPAC",
    title: "DADG IMEPAC | Diretório Acadêmico Diogo Guimarães",
    description:
      "Representação oficial dos estudantes de Medicina da IMEPAC Araguari. Conheça nossas coordenadorias, eventos e conquistas.",
    images: [
      {
        url: "/imepac-hero.jpg",
        width: 1200,
        height: 630,
        alt: "Campus IMEPAC Araguari — Diretório Acadêmico Diogo Guimarães",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DADG IMEPAC | Diretório Acadêmico Diogo Guimarães",
    description:
      "Representação oficial dos estudantes de Medicina da IMEPAC Araguari.",
    images: ["/imepac-hero.jpg"],
  },
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const session = await auth0.getSession();

  // Default to light mode on first visit
  const theme = cookieStore.get("dadg-theme")?.value === "dark" ? "dark" : "light";

  const { blogEnabled } = await getSiteSettings();

  return (
    <html
      lang="pt-BR"
      className={theme === "dark" ? "dark" : undefined}
      style={{ colorScheme: theme }}
      suppressHydrationWarning
    >
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:top-0 focus:z-[2000] bg-white p-3 text-blue-900">Pular para o conteúdo</a>
        <ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
          <UpcomingSchedulePopup />
          <UserProvider isAuthenticated={Boolean(session?.user)}>
            <MenuDrawer blogEnabled={blogEnabled} />
            <MobileBottomNav blogEnabled={blogEnabled} />
            <div className="main-content pb-16 md:pb-0 flex flex-col min-h-screen">
              <div id="conteudo" tabIndex={-1} className="flex-grow">
                {children}
              </div>
              <Footer />
            </div>
          </UserProvider>


        </ThemeProvider>
      </body>
    </html>
  );
}
