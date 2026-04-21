import Link from "next/link";
import { ChevronDown } from "lucide-react";
import CoordinatorTemplate from "@/app/components/coordinator-template";
import { SectionHeading } from "@/app/components/site-sections";
import { coordinatorProfiles } from "@/app/lib/site-content";
import GetAllNamesAndAcronym from "@/app/lib/models/src/AcademicLeagues/GetAllNamesAndAcronym";

export const dynamic = "force-dynamic";

const leagueGroups = [
  {
    key: "basic",
    title: "Ciclo básico",
    description: "Ligas com foco nas bases da formação médica e na consolidação dos primeiros ciclos.",
  },
  {
    key: "clinic",
    title: "Ciclo clínico",
    description: "Ligas voltadas para prática, aprofundamento e experiências ligadas ao cuidado clínico.",
  },
] as const;

export default async function CLAMPage() {
  const leagues = await GetAllNamesAndAcronym();

  return (
    <CoordinatorTemplate profile={coordinatorProfiles.clam}>
      <section className="page-shell space-y-8">
        <SectionHeading
          eyebrow="Ligas"
          title="Explore as ligas acadêmicas"
          description="Abra cada grupo para navegar pelas ligas vinculadas à CLAM e seguir para a página detalhada de cada uma."
        />

        <div className="grid gap-5 xl:grid-cols-2">
          {leagueGroups.map((group) => {
            const items = leagues.filter((league) => league.type === group.key);

            return (
              <details
                key={group.key}
                className="glass-panel surface-outline overflow-hidden rounded-[28px] border border-white/70 p-5"
                open
              >
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 rounded-[22px] bg-white/70 px-4 py-4 text-left [&::-webkit-details-marker]:hidden dark:bg-slate-900/56">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
                      {items.length} liga{items.length === 1 ? "" : "s"}
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">{group.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{group.description}</p>
                  </div>
                  <ChevronDown className="mt-1 h-5 w-5 flex-none text-slate-500 dark:text-slate-400" />
                </summary>

                <div className="mt-4 space-y-3">
                  {items.length === 0 ? (
                    <p className="rounded-[22px] border border-dashed border-[rgba(9,66,125,0.18)] bg-white/72 px-4 py-5 text-sm font-medium text-slate-500 dark:bg-slate-900/68 dark:text-slate-400">
                      Nenhuma liga cadastrada neste grupo no momento.
                    </p>
                  ) : (
                    <ul className="space-y-3">
                      {items.map((league) => (
                        <li key={String(league._id)}>
                          <Link
                            href={`/coordenadorias/clam/liga/${String(league._id)}`}
                            className="block rounded-[22px] border border-white/70 bg-white/80 px-4 py-4 text-sm font-medium text-slate-700 transition-transform duration-300 hover:-translate-y-0.5 hover:text-slate-950 dark:border-white/10 dark:bg-slate-900/72 dark:text-slate-200 dark:hover:text-white"
                          >
                            <span className="font-semibold">{league.name}</span>
                            <span className="ml-2 text-slate-500 dark:text-slate-400">({league.acronym})</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </details>
            );
          })}
        </div>
      </section>
    </CoordinatorTemplate>
  );
}
