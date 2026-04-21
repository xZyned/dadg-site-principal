"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { CoordinatorProfile } from "@/app/lib/site-content";
import { InfoCard, SectionHeading, StatStrip } from "@/app/components/site-sections";

type CoordinatorTemplateProps = {
  profile: CoordinatorProfile;
  children?: ReactNode;
};

export default function CoordinatorTemplate({ profile, children }: CoordinatorTemplateProps) {
  return (
    <div className="space-y-12 pb-8 sm:space-y-16">
      <section className="page-shell">
        <div className="glass-panel surface-outline relative overflow-hidden rounded-[36px] border border-white/60 px-6 py-8 sm:px-10 sm:py-12 dark:border-white/10">
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at top right, ${profile.accent.surface}, transparent 36%), radial-gradient(circle at bottom left, rgba(255,255,255,0.35), transparent 28%)`,
            }}
          />
          <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1.25fr)_360px] lg:items-center">
            <div>
              <span className="section-eyebrow">{profile.shortName}</span>
              <h1 className="section-title max-w-4xl">{profile.subtitle}</h1>
              <p className="section-subtitle mt-5 max-w-3xl">{profile.description}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/coordenadorias"
                  className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-[var(--brand-900)]"
                >
                  Voltar para coordenadorias
                </Link>
              </div>
            </div>

            <div className="mx-auto w-full max-w-[320px]">
              <div className="relative rounded-[32px] border border-white/60 bg-white/78 p-4 shadow-[0_24px_60px_rgba(7,48,89,0.12)] dark:border-white/10 dark:bg-slate-900/72">
                <div
                  className="absolute inset-x-10 top-0 h-32 rounded-full blur-3xl"
                  style={{ backgroundColor: profile.accent.surface }}
                />
                <div className="relative aspect-square overflow-hidden rounded-[28px] border border-white/70 bg-white dark:border-white/10 dark:bg-slate-950/72">
                  <Image
                    src={profile.imageSrc}
                    alt={`Logo ${profile.shortName}`}
                    fill
                    sizes="(max-width: 1024px) 320px, 320px"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          <StatStrip items={profile.stats} className="relative mt-10" />
        </div>
      </section>

      <section className="page-shell">
        <div className="grid gap-5 lg:grid-cols-3">
          {profile.overview.map((item) => (
            <InfoCard key={item.title} title={item.title} description={item.text} />
          ))}
        </div>
      </section>

      <section className="page-shell grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
        <InfoCard title="Missão" description={profile.mission} className="h-full">
          <div className="rounded-[24px] border border-[rgba(9,66,125,0.08)] bg-slate-950 px-5 py-5 text-sm leading-7 text-slate-200">
            {profile.summary}
          </div>
        </InfoCard>

        <InfoCard title="Valores que orientam a coordenadoria" className="h-full">
          <ul className="space-y-3">
            {profile.values.map((value) => (
              <li key={value} className="flex items-start gap-3 rounded-[20px] bg-white/70 px-4 py-3 dark:bg-slate-900/72">
                <CheckCircle2
                  className="mt-0.5 h-5 w-5 flex-none"
                  style={{ color: profile.accent.primary }}
                />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200 sm:text-base">{value}</span>
              </li>
            ))}
          </ul>
        </InfoCard>
      </section>

      <section className="page-shell space-y-8">
        <SectionHeading
          eyebrow="Destaques"
          title={`Como a ${profile.shortName} agrega valor ao ecossistema acadêmico`}
          description="Cada coordenadoria tem um papel próprio, mas todas compartilham o objetivo de fortalecer a experiência estudantil de forma consistente."
        />

        <div className="grid gap-5 lg:grid-cols-3">
          {profile.highlights.map((highlight) => (
            <InfoCard
              key={highlight}
              title={highlight}
              className="min-h-[190px]"
              description="Um ponto central da coordenadoria dentro da atuação do DADG e da experiência acadêmica dos estudantes."
            />
          ))}
        </div>
      </section>

      {children}

      {profile.team?.length ? (
        <section className="page-shell space-y-8">
          <SectionHeading
            eyebrow="Equipe"
            title={`Pessoas que movem a ${profile.shortName}`}
            description="A coordenadoria também ganha uma apresentação mais humana, aproximando estudantes de quem faz o trabalho acontecer."
          />

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {profile.team.map((member) => (
              <article
                key={member.name}
                className="glass-panel surface-outline overflow-hidden rounded-[28px] border border-white/70 p-4 dark:border-white/10"
              >
                <div className="relative aspect-[4/4.2] overflow-hidden rounded-[24px]">
                  <Image
                    src={member.photo}
                    alt={member.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="px-2 pb-2 pt-5">
                  <p className="text-xl font-semibold text-slate-950 dark:text-white">{member.name}</p>
                  <p className="mt-2 text-sm uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">{member.role}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {profile.qrCode ? (
        <section className="page-shell">
          <div className="glass-panel surface-outline overflow-hidden rounded-[32px] border border-white/70 p-6 sm:p-8 dark:border-white/10">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-center">
              <div>
                <span className="section-eyebrow">Canal direto</span>
                <h2 className="section-title !text-3xl sm:!text-4xl">{profile.qrCode.title}</h2>
                <p className="section-subtitle mt-4 max-w-2xl">{profile.qrCode.caption}</p>
                <Link
                  href="/contato"
                  className="mt-7 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-[var(--brand-900)]"
                >
                  Ver canais de contato
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="mx-auto w-full max-w-[260px] rounded-[28px] bg-white p-4 shadow-[0_24px_60px_rgba(7,48,89,0.12)] dark:bg-slate-900/72">
                <div className="relative aspect-square overflow-hidden rounded-[24px]">
                  <Image
                    src={profile.qrCode.src}
                    alt={profile.qrCode.title}
                    fill
                    sizes="(max-width: 1024px) 260px, 260px"
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
