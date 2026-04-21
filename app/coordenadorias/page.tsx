import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero, SectionHeading } from "@/app/components/site-sections";
import { coordinatorCards } from "@/app/lib/site-content";

export default function CoordenadoriasPage() {
  return (
    <div className="space-y-12 pb-8 sm:space-y-14">
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
            <Link key={card.slug} href={`/coordenadorias/${card.slug}`} className="group">
              <article className="overflow-hidden rounded-[30px] border border-white/70 bg-white p-5 shadow-[0_18px_40px_rgba(7,48,89,0.08)] transition-transform duration-300 group-hover:-translate-y-1 dark:border-white/10 dark:bg-slate-900/80">
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
                <h2 className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white">{card.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{card.summary}</p>

                <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
                  Abrir página
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
