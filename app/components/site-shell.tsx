"use client";

import * as Dialog from "@radix-ui/react-dialog";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ChevronRight, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { coordinatorCards, siteNavigation } from "@/app/lib/site-content";
import ThemeToggle from "@/app/components/theme-toggle";

type SiteShellProps = {
  children: ReactNode;
};

export default function SiteShell({ children }: SiteShellProps) {
  const pathname = usePathname() || "/";
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <Dialog.Root open={menuOpen} onOpenChange={setMenuOpen}>
      <div className="relative min-h-screen overflow-x-clip">
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute left-[-10%] top-[-6rem] h-80 w-80 rounded-full bg-[rgba(79,143,214,0.24)] blur-[120px]" />
          <div className="absolute right-[-12%] top-[15%] h-96 w-96 rounded-full bg-[rgba(9,66,125,0.18)] blur-[140px]" />
          <div className="absolute bottom-[-8rem] left-[12%] h-80 w-80 rounded-full bg-[rgba(217,192,124,0.16)] blur-[120px]" />
        </div>

        <header className="sticky top-0 z-50 px-3 pt-3 sm:px-5">
          <div className="page-shell">
            <div className="glass-panel-strong surface-outline flex items-center justify-between rounded-[26px] border border-white/70 px-4 py-3 sm:px-6 lg:grid lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:gap-6 lg:justify-normal">
              <div className="flex min-w-0 items-center gap-3">
                <Link href="/" className="flex items-center gap-3">
                  <div className="relative h-11 w-11 overflow-hidden rounded-full border border-white/80 bg-white shadow-[0_10px_30px_rgba(7,48,89,0.14)]">
                    <Image src="/logoDadg02.png" alt="Logo DADG" fill sizes="44px" className="object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.32em] text-slate-500 dark:text-slate-400">DADG</p>
                    <p className="text-sm font-medium text-slate-950 dark:text-slate-100 sm:text-base">Imepac Araguari</p>
                  </div>
                </Link>
              </div>

              <nav className="hidden items-center justify-center gap-1 lg:flex lg:px-2">
                {siteNavigation.map((item) => {
                  const isActive = item.href === "/" ? pathname === item.href : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "rounded-full px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white",
                        isActive && "bg-slate-950 text-white hover:text-white"
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="hidden items-center justify-end gap-3 lg:flex">
                <ThemeToggle />
                <Link
                  href="/ouvidoria"
                  className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--brand-900)]"
                >
                  Fale com o DADG
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <Dialog.Trigger asChild>
                <button
                  type="button"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(9,66,125,0.12)] bg-white text-slate-950 dark:border-white/15 dark:bg-white dark:text-black lg:hidden"
                  aria-label="Abrir navegacao"
                >
                  <Menu className="h-5 w-5" />
                </button>
              </Dialog.Trigger>
            </div>
          </div>
        </header>

        <main className="relative z-10 pb-20 pt-8">{children}</main>

        <footer className="page-shell pb-8">
          <div className="glass-panel-strong surface-outline overflow-hidden rounded-[32px] border border-white/70 px-6 py-8 sm:px-8 sm:py-10">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_repeat(3,minmax(0,0.8fr))]">
              <div className="space-y-5">
                <span className="section-eyebrow">Portal institucional</span>
                <h2 className="section-title !text-3xl sm:!text-4xl">Diretório Acadêmico Diogo Guimarães</h2>
                <p className="max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
                  Serviços, coordenadorias, agenda e canais oficiais reunidos em um portal claro, direto e fácil de usar.
                </p>
              </div>

              <FooterColumn
                title="Navegacao"
                items={siteNavigation.slice(0, 4).map((item) => ({ href: item.href, label: item.label }))}
              />
              <FooterColumn
                title="Coordenadorias"
                items={coordinatorCards.map((item) => ({ href: `/coordenadorias/${item.slug}`, label: item.shortName }))}
              />
              <FooterColumn
                title="Contato"
                items={[
                  { href: "mailto:dadg.imepac@gmail.com", label: "dadg.imepac@gmail.com", external: true },
                  { href: "/contato", label: "Redes sociais" },
                  { href: "/ouvidoria", label: "Ouvidoria" },
                ]}
              />
            </div>

            <div className="mt-10 border-t border-[rgba(9,66,125,0.08)] pt-6">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {new Date().getFullYear()} DADG Imepac Araguari. Canais oficiais, serviços e informações institucionais.
              </p>
            </div>
          </div>
        </footer>

        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[60] bg-slate-950/28 backdrop-blur-sm lg:hidden" />
          <Dialog.Content className="fixed right-0 top-0 z-[70] flex h-screen w-full max-w-sm flex-col bg-[linear-gradient(180deg,#073059_0%,#041a31_100%)] p-6 text-white shadow-[0_30px_80px_rgba(4,26,49,0.35)] lg:hidden">
            <Dialog.Title className="sr-only">Menu principal</Dialog.Title>
            <Dialog.Description className="sr-only">
              Navegue pelas páginas institucionais, coordenadorias e canais de contato do DADG.
            </Dialog.Description>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative h-11 w-11 overflow-hidden rounded-full border border-white/20 bg-white/10">
                  <Image src="/logoDadg02.png" alt="Logo DADG" fill sizes="44px" className="object-cover" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.32em] text-blue-200/80">DADG</p>
                  <p className="text-base font-semibold">Navegação</p>
                </div>
              </div>
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white text-black"
                  aria-label="Fechar navegacao"
                >
                  <X className="h-5 w-5" />
                </button>
              </Dialog.Close>
            </div>

            <div className="mt-6">
              <ThemeToggle />
            </div>

            <div className="mt-8 flex-1 space-y-2 overflow-y-auto pr-2">
              {siteNavigation.map((item) => {
                const isActive = item.href === "/" ? pathname === item.href : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "block rounded-[20px] border border-white/10 px-4 py-4",
                      isActive ? "bg-white/16" : "bg-white/6 hover:bg-white/10"
                    )}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold">{item.label}</p>
                        <p className="mt-1 text-sm text-blue-100/72">{item.description}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 flex-none text-blue-100/70" />
                    </div>
                  </Link>
                );
              })}

              <div className="rounded-[24px] border border-white/10 bg-white/6 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-blue-200/80">Coordenadorias</p>
                <div className="mt-4 grid gap-2">
                  {coordinatorCards.map((item) => (
                    <Link
                      key={item.slug}
                      href={`/coordenadorias/${item.slug}`}
                      className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm font-medium text-blue-50/92 hover:bg-white/10"
                    >
                      {item.shortName}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link
              href="/ouvidoria"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[var(--brand-950)]"
            >
              Abrir ouvidoria
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Dialog.Content>
        </Dialog.Portal>
      </div>
    </Dialog.Root>
  );
}

type FooterColumnProps = {
  title: string;
  items: Array<{
    href: string;
    label: string;
    external?: boolean;
  }>;
};

function FooterColumn({ title, items }: FooterColumnProps) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500 dark:text-slate-400">{title}</p>
      <div className="mt-5 grid gap-3">
        {items.map((item) => (
          <Link
            key={`${title}-${item.label}`}
            href={item.href}
            target={item.external ? "_blank" : undefined}
            rel={item.external ? "noopener noreferrer" : undefined}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
          >
            <span>{item.label}</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        ))}
      </div>
    </div>
  );
}
