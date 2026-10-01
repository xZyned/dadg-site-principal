import { BellRing } from "lucide-react";
import { PageHero } from "@/app/components/site-sections";
import { getContentfulClient } from "../lib/contentful";

export const dynamic = "force-dynamic";

export default async function MuralPage() {
  let unavailable = false;
  let murais: { id: string; text: string; tag: string; date: string }[] = [];
  try {
    const client = getContentfulClient();
    if (!client) throw new Error("Mural indisponível");
    const response = await client.getEntries({
      content_type: "mural",
      limit: 100,
      order: ["-sys.createdAt"],
    });
    murais = response.items
      .map((item) => ({
        id: item.sys.id,
        text:
          typeof item.fields.listaDoMural === "string"
            ? item.fields.listaDoMural
            : "",
        tag: typeof item.fields.arco === "string" ? item.fields.arco : "",
        date: item.sys.createdAt,
      }))
      .filter((item) => item.text);
  } catch {
    unavailable = true;
  }

  return (
    <div className="space-y-12 pt-28 pb-8 sm:space-y-14">
      <PageHero
        eyebrow="Mural"
        title="Avisos e comunicados"
        description="Recados publicados pelo DADG em um espaço simples, direto e fácil de consultar."
        aside={
          <div className="rounded-[28px] border border-white/70 bg-white px-5 py-5 shadow-[0_18px_40px_rgba(7,48,89,0.08)] dark:border-white/10 dark:bg-slate-900/72">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
              Atualizações
            </p>
            <p className="mt-3 text-lg font-semibold text-slate-950 dark:text-white">
              {unavailable
                ? "Avisos temporariamente indisponíveis"
                : `${murais.length} aviso(s) disponível(is)`}
            </p>
          </div>
        }
      />

      <section className="page-shell">
        {murais.length === 0 ? (
          <div className="rounded-[30px] border border-dashed border-[rgba(9,66,125,0.18)] bg-white px-6 py-12 text-center text-sm font-medium text-slate-500 dark:bg-slate-900/68 dark:text-slate-400">
            {unavailable
              ? "Não foi possível carregar o mural. Atualize a página para tentar novamente."
              : "Nenhum aviso publicado no momento."}
          </div>
        ) : (
          <div className="space-y-4">
            {murais.map((mural) => {
              const hasArco = Boolean(mural.tag);

              return (
                <article
                  key={mural.id}
                  className="block overflow-hidden rounded-[28px] border border-white/70 bg-white p-5 shadow-[0_18px_40px_rgba(7,48,89,0.08)] transition-transform duration-300 hover:-translate-y-1 dark:border-white/10 dark:bg-slate-900/72"
                >
                  <div className="flex items-start gap-4">
                    <div className="inline-flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-[var(--brand-50)] text-[var(--brand-800)]">
                      <BellRing className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
                        Aviso
                      </p>
                      <p className="mt-2 text-base leading-7 text-slate-900 dark:text-slate-100 sm:text-lg">
                        {mural.text}
                      </p>
                      <time
                        className="text-xs text-slate-500"
                        dateTime={mural.date}
                      >
                        {new Date(mural.date).toLocaleDateString("pt-BR", {
                          timeZone: "America/Sao_Paulo",
                        })}
                      </time>
                      {hasArco ? (
                        <p className="mt-3 inline-flex rounded-full bg-[var(--brand-50)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--brand-800)]">
                          {mural.tag}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
