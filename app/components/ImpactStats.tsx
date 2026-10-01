"use client";
import { useEffect, useState } from "react";
type Stats = {
  certificadosEmitidos: number;
  eventosRealizados: number;
  coordenadoriasAtivas: number;
};
export default function ImpactStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/get/homeStats", { signal: controller.signal })
      .then(async (r) => {
        if (!r.ok) throw new Error();
        const value = await r.json();
        if (
          ![
            value.certificadosEmitidos,
            value.eventosRealizados,
            value.coordenadoriasAtivas,
          ].every((n) => Number.isSafeInteger(n) && n >= 0)
        )
          throw new Error();
        setStats(value);
      })
      .catch(() => {
        if (!controller.signal.aborted) setFailed(true);
      });
    return () => controller.abort();
  }, []);
  return (
    <section
      aria-label="Acervo DADG"
      className="bg-[#002B5B] px-6 py-14 text-white"
    >
      <div className="page-shell">
        <h2 className="mb-6 text-2xl font-semibold">
          Nossa comunidade e nosso acervo
        </h2>
        {stats ? (
          <dl className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              [stats.certificadosEmitidos, "Certificados liberados"],
              [stats.eventosRealizados, "Eventos publicados no acervo"],
              [stats.coordenadoriasAtivas, "Ligas cadastradas"],
            ].map(([n, label]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd className="text-4xl font-bold">
                  {Number(n).toLocaleString("pt-BR")}
                </dd>
              </div>
            ))}
          </dl>
        ) : (
          <p role="status">
            {failed
              ? "Estatísticas temporariamente indisponíveis."
              : "Carregando estatísticas…"}
          </p>
        )}
      </div>
    </section>
  );
}
