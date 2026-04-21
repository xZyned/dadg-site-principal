import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  FileCheck2,
  Mail,
  MessageSquareQuote,
  UsersRound,
} from "lucide-react";
import UpcomingSchedulePopup from "@/app/components/UpcomingSchedulePopup";
import { InfoCard, PageHero, SectionHeading } from "@/app/components/site-sections";
import { coordinatorCards } from "@/app/lib/site-content";

const serviceCards = [
  {
    href: "/certificados",
    title: "Certificados",
    description: "Busca, validação e acesso direto aos certificados.",
    icon: FileCheck2,
  },
  {
    href: "/eventos",
    title: "Eventos",
    description: "Calendário acadêmico e programação do DADG.",
    icon: CalendarDays,
  },
  {
    href: "/coordenadorias",
    title: "Coordenadorias",
    description: "Conheça os núcleos e suas páginas.",
    icon: UsersRound,
  },
  {
    href: "/ouvidoria",
    title: "Ouvidoria",
    description: "Sugestões, reclamações e dúvidas.",
    icon: MessageSquareQuote,
  },
  {
    href: "/contato",
    title: "Contato",
    description: "Redes sociais, e-mail e canais oficiais.",
    icon: Mail,
  },
];

export default function Home() {
  return (
    <div className="space-y-12 pb-8 sm:space-y-14">
      <UpcomingSchedulePopup />

      <PageHero
        eyebrow="DADG Imepac"
        title="Diretório Acadêmico Diogo Guimarães"
        titleClassName="text-[var(--brand-800)] dark:text-white"
        description="Acesso rápido aos principais serviços, páginas institucionais e canais oficiais do DADG."
        actions={
          <>
            <Link
              href="/certificados"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-[var(--brand-900)]"
            >
              Abrir certificados
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/eventos"
              className="inline-flex items-center justify-center rounded-full border border-[rgba(9,66,125,0.16)] bg-white/85 px-5 py-3 text-sm font-semibold text-slate-700 hover:border-[rgba(9,66,125,0.26)] hover:text-slate-950 dark:border-white/10 dark:bg-slate-900/75 dark:text-slate-100 dark:hover:border-white/20 dark:hover:text-white"
            >
              Ver eventos
            </Link>
          </>
        }
        aside={
          <div className="space-y-3">
            <div className="glass-panel surface-outline relative overflow-hidden rounded-[28px] border border-white/70 p-5">
              <div className="relative flex items-center gap-4">
                <div className="relative h-20 w-20 overflow-hidden rounded-[24px] border border-white/70 bg-white shadow-[0_16px_40px_rgba(7,48,89,0.12)]">
                  <Image src="/logoDadg02.png" alt="Logo DADG" fill sizes="80px" className="object-cover" />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.32em] text-slate-500 dark:text-slate-400">DADG</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">Imepac Araguari</p>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {[
                ["Certificados", "Busca e validação"],
                ["Agenda", "Eventos e calendário"],
                ["Canais", "Contato e ouvidoria"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-[22px] border border-white/70 bg-white/78 px-4 py-4 shadow-[0_18px_40px_rgba(7,48,89,0.08)] dark:border-white/10 dark:bg-slate-900/72"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">{label}</p>
                  <p className="mt-2 text-base font-semibold text-slate-950 dark:text-white">{value}</p>
                </div>
              ))}
            </div>
          </div>
        }
      />

      <section className="page-shell space-y-8">
        <SectionHeading
          eyebrow="Acesso rápido"
          title="Tudo em um clique"
          description="Entrada direta para as áreas mais importantes do site."
        />

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {serviceCards.map((card) => {
            const Icon = card.icon;

            return (
              <Link key={card.href} href={card.href} className="group">
                <InfoCard
                  title={card.title}
                  description={card.description}
                  className="h-full transition-transform duration-300 group-hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-50)] text-[var(--brand-800)]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                      Abrir
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </InfoCard>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="page-shell space-y-8">
        <SectionHeading
          eyebrow="Coordenadorias"
          title="Áreas de atuação"
          description="Acesso rápido às coordenadorias do DADG."
        />

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {coordinatorCards.map((card) => (
            <Link key={card.slug} href={`/coordenadorias/${card.slug}`} className="group">
              <article className="glass-panel surface-outline h-full overflow-hidden rounded-[30px] border border-white/70 p-5 transition-transform duration-300 group-hover:-translate-y-1 dark:border-white/10">
                <div
                  className="mb-5 rounded-[24px] p-4"
                  style={{
                    background: `linear-gradient(135deg, ${card.accent.primary}, ${card.accent.secondary})`,
                  }}
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] border border-white/20 bg-white/10">
                    <Image
                      src={card.imageSrc}
                      alt={card.shortName}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                </div>
                <p className="text-sm font-semibold uppercase tracking-[0.32em] text-slate-500 dark:text-slate-400">{card.shortName}</p>
                <h3 className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white">{card.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{card.summary}</p>
              </article>
            </Link>
          ))}
        </div>
      </section>

      <section className="page-shell">
        <div className="overflow-hidden rounded-[32px] bg-slate-950 px-6 py-8 text-white shadow-[0_32px_90px_rgba(4,26,49,0.22)] sm:px-10 sm:py-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div>
              <h2 className="text-3xl font-semibold sm:text-4xl">Precisa falar com o DADG?</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-blue-100/78 sm:text-base">
                Para assuntos importantes, sugestões, reclamações ou dúvidas, use a ouvidoria.
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
