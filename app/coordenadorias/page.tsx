import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero, SectionHeading } from "@/app/components/site-sections";
import { coordinatorCards } from "@/app/lib/site-content";

export default function CoordenadoriasPage() {
  return (
    <div className="space-y-12 pt-28 pb-8 sm:space-y-14">
      <PageHero
        eyebrow="Coordenadorias"
        title="Áreas do DADG"
        description="Acesse rapidamente cada coordenadoria e sua página própria."
        aside={
          <div className="glass-panel-strong surface-outline relative overflow-hidden rounded-[28px] border border-white/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(243,247,252,0.94)_100%)] px-5 py-5 shadow-[0_24px_64px_rgba(4,26,49,0.14)] dark:border-white/12 dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.92)_0%,rgba(2,6,23,0.86)_100%)]">
            <div className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(9,66,125,0.35)] to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(79,143,214,0.14),transparent_42%)]" />
            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Acesso rápido</p>
              <p className="mt-3 text-lg font-semibold text-slate-950 dark:text-white">Cinco coordenadorias principais.</p>
            </div>
          </div>
        }
      />

      <section className="page-shell space-y-8">
        <SectionHeading
          eyebrow="Núcleos"
          title="Escolha uma coordenadoria"
          description="Cada área tem acesso próprio, identidade preservada e página dedicada."
        />

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {coordinatorCards.map((card) => (
            <Link key={card.slug} href={`/coordenadorias/${card.slug}`} className="group outline-none">
              <article className="flex h-full flex-col items-center text-center overflow-hidden rounded-[32px] border border-slate-200/60 bg-white p-8 shadow-[0_12px_40px_rgba(7,48,89,0.06)] transition-all duration-400 ease-out hover:-translate-y-1.5 hover:shadow-[0_30px_60px_rgba(7,48,89,0.12)] dark:border-slate-800/60 dark:bg-slate-900/50 dark:hover:bg-slate-900/80">
                <div
                  className="mb-6 flex shrink-0 items-center justify-center rounded-full p-[3px] transition-transform duration-500 group-hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${card.accent.primary}, ${card.accent.secondary})`,
                  }}
                >
                  <div className="relative h-32 w-32 overflow-hidden rounded-full border-[3px] border-white dark:border-slate-900">
                    <Image
                      src={card.imageSrc}
                      alt={card.shortName}
                      fill
                      sizes="128px"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                </div>

                <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">{card.shortName}</p>
                <h2 className="mt-3 text-xl font-bold leading-tight text-slate-900 dark:text-white">{card.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 line-clamp-3 dark:text-slate-400 flex-grow">{card.summary}</p>

                <div className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-50 py-3 text-sm font-semibold text-slate-700 transition-colors duration-300 group-hover:bg-blue-50 group-hover:text-blue-700 dark:bg-slate-800/50 dark:text-slate-300 dark:group-hover:bg-slate-800 dark:group-hover:text-blue-400">
                  Explorar
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
