import Link from "next/link";
import { ArrowRight, Instagram, Mail } from "lucide-react";
import { InfoCard, PageHero } from "@/app/components/site-sections";
import { socialAccounts } from "@/app/lib/site-content";

export default function ContatoPage() {
  return (
    <div className="space-y-12 pb-8 sm:space-y-14">
      <PageHero
        eyebrow="Contato"
        title="Canais oficiais"
        description="Redes sociais, e-mail e acesso rápido à ouvidoria."
        aside={
          <InfoCard title="E-mail principal" description="dadg.imepac@gmail.com">
            <a
              href="mailto:dadg.imepac@gmail.com"
              className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-3 text-sm font-semibold text-white hover:bg-[var(--brand-900)]"
            >
              <Mail className="h-4 w-4" />
              Enviar e-mail
            </a>
          </InfoCard>
        }
      />

      <section className="page-shell grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {socialAccounts.map((account) => (
          <Link
            key={account.handle}
            href={account.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group"
          >
            <InfoCard title={account.name} description={account.handle} className="h-full transition-transform duration-300 group-hover:-translate-y-1">
              <div className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-50)] px-3 py-2 text-sm font-semibold text-[var(--brand-800)]">
                <Instagram className="h-4 w-4" />
                Abrir Instagram
              </div>
            </InfoCard>
          </Link>
        ))}
      </section>

      <section className="page-shell">
        <div className="overflow-hidden rounded-[32px] bg-slate-950 px-6 py-8 text-white shadow-[0_32px_90px_rgba(4,26,49,0.22)] sm:px-10 sm:py-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div>
              <h2 className="text-3xl font-semibold sm:text-4xl">Para assuntos mais sensíveis</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-blue-100/78 sm:text-base">
                Use a ouvidoria quando precisar registrar uma mensagem com mais contexto.
              </p>
            </div>

            <Link
              href="/ouvidoria"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[var(--brand-950)]"
            >
              Abrir ouvidoria
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
