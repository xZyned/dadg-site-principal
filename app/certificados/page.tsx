"use client";
import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
type Result = { _id: string; ownerName: string; eventName: string };
export default function Certificates() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(false);
  const [activeQuery, setActiveQuery] = useState("");
  useEffect(() => {
    try {
      localStorage.removeItem("certificateSearch");
      localStorage.removeItem("certificateResults");
    } catch {
      /* Storage can be unavailable in private contexts. */
    }
  }, []);
  async function search(event?: FormEvent, nextPage = 1) {
    event?.preventDefault();
    const value = nextPage === 1 ? query.trim() : activeQuery;
    if (value.length < 3) {
      setError("Digite pelo menos 3 caracteres.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `/api/get/myCertificate/${encodeURIComponent(value)}?page=${nextPage}`,
        { cache: "no-store" },
      );
      const body = await response.json();
      if (!response.ok)
        throw new Error(
          body.message ||
            body.error ||
            "Não foi possível consultar os certificados.",
        );
      setResults(nextPage === 1 ? body.data : [...results, ...body.data]);
      setMore(body.hasMore === true);
      setPage(nextPage);
      setActiveQuery(value);
      setSearched(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Falha de conexão.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <section className="page-shell py-28 space-y-6">
      <header>
        <p className="section-eyebrow">Consulta pública</p>
        <h1 className="text-3xl font-bold">Certificados</h1>
        <p className="mt-3">
          Pesquise pelo nome, evento, código, CPF completo ou e-mail completo.
        </p>
      </header>
      <form onSubmit={search} className="flex flex-wrap gap-3">
        <label htmlFor="certificate-search" className="sr-only">
          Buscar certificado
        </label>
        <input
          id="certificate-search"
          minLength={3}
          maxLength={120}
          required
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="min-w-0 flex-1 rounded-xl border p-3 text-slate-900"
          placeholder="Nome, evento ou código"
        />
        <button
          disabled={loading}
          className="rounded-xl bg-blue-700 px-5 py-3 text-white disabled:opacity-50"
        >
          {loading ? "Consultando…" : "Buscar"}
        </button>
      </form>
      {error && <p role="alert">{error}</p>}
      <div aria-live="polite">
        {searched && !results.length && !loading && (
          <p>
            Nenhum certificado encontrado. Confira a busca ou{" "}
            <Link className="underline" href="/ouvidoria">
              fale com a Ouvidoria
            </Link>
            .
          </p>
        )}
      </div>
      <ul className="grid gap-4 sm:grid-cols-2">
        {results.map((item) => (
          <li key={item._id} className="rounded-2xl border p-5">
            <h2 className="font-semibold">{item.eventName}</h2>
            <p>{item.ownerName}</p>
            <Link
              className="mt-3 inline-block font-semibold text-blue-600"
              href={`/certificados/meuCertificado/${item._id}`}
            >
              Abrir certificado
            </Link>
          </li>
        ))}
      </ul>
      {more && (
        <button
          disabled={loading}
          onClick={() => void search(undefined, page + 1)}
          className="rounded-xl border p-3"
        >
          Carregar mais
        </button>
      )}
      <aside className="rounded-2xl bg-blue-50 p-5 text-slate-900">
        <h2 className="font-semibold">Seus certificados na sua conta</h2>
        <p>
          Consulte os vínculos e solicite a revisão de certificados antigos na
          área pessoal.
        </p>
        <Link href="/perfil/certificados" className="underline">
          Meus certificados
        </Link>
      </aside>
    </section>
  );
}
