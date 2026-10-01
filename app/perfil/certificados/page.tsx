"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
type Certificate = { _id: string; eventName: string; ownerName: string };
type Claim = {
  _id: string;
  certificateId: string;
  status: string;
  reason?: string;
};
export default function MyCertificates() {
  const [items, setItems] = useState<Certificate[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState("");
  const [auto, setAuto] = useState(false);
  const [busy, setBusy] = useState(false);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(false);
  async function load(p = 1) {
    const response = await fetch(`/api/v1/user/certificates?page=${p}`);
    const body = await response.json();
    if (!response.ok)
      throw new Error(body.error || "Entre na conta e complete seu perfil.");
    setItems((previous) => (p === 1 ? body.data : [...previous, ...body.data]));
    setClaims(body.claims);
    setAuto(body.automaticEnabled);
    setMore(body.hasMore);
    setPage(p);
  }
  useEffect(() => {
    void load().catch((e) => setFeedback(e.message));
  }, []);
  async function submit(path: string, body?: unknown) {
    setBusy(true);
    setFeedback("");
    try {
      const response = await fetch(`/api/v1/user/certificates/${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setFeedback(
        path === "link"
          ? `${result.linked} certificado(s) vinculado(s).`
          : "Solicitação enviada para revisão.",
      );
      await load();
    } catch (e) {
      setFeedback((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="page-shell py-28 space-y-6">
      <Link href="/perfil" className="underline">
        Meu perfil / entrar na conta
      </Link>
      <h1 className="text-3xl font-bold">Meus certificados</h1>
      <p>
        Certificados históricos podem ser vinculados sem criar inscrições
        antigas.
      </p>
      {feedback && <p role="status">{feedback}</p>}
      {auto && (
        <button
          disabled={busy}
          onClick={() => void submit("link")}
          className="rounded-xl bg-blue-700 p-3 text-white"
        >
          Procurar correspondências verificadas
        </button>
      )}
      <ul className="grid gap-3 sm:grid-cols-2">
        {items.map((c) => (
          <li className="rounded-xl border p-4" key={c._id}>
            <h2>{c.eventName}</h2>
            <Link
              className="underline"
              href={`/certificados/meuCertificado/${c._id}`}
            >
              Abrir certificado
            </Link>
          </li>
        ))}
      </ul>
      {more && (
        <button
          onClick={() =>
            void load(page + 1).catch((e) => setFeedback(e.message))
          }
        >
          Carregar mais
        </button>
      )}
      <form
        className="space-y-3 rounded-2xl border p-5"
        onSubmit={(e) => {
          e.preventDefault();
          void submit("claims", { certificateId: code.trim(), message });
        }}
      >
        <h2 className="text-xl font-semibold">
          Solicitar vínculo de certificado antigo
        </h2>
        <p>
          Localize o código na{" "}
          <Link href="/certificados" className="underline">
            consulta pública
          </Link>
          . A organização verificará a titularidade; coincidência de nome não é
          suficiente.
        </p>
        <label className="block">
          Código do certificado
          <input
            required
            pattern="[a-fA-F0-9]{24}"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="block w-full rounded border p-3 text-slate-900"
          />
        </label>
        <label className="block">
          Informações para conferência
          <textarea
            required
            minLength={10}
            maxLength={1000}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="block w-full rounded border p-3 text-slate-900"
          />
        </label>
        <button
          disabled={busy}
          className="rounded-xl bg-blue-700 p-3 text-white"
        >
          Enviar solicitação
        </button>
      </form>
      <h2 className="text-xl font-semibold">Minhas solicitações</h2>
      <ul>
        {claims.map((c) => (
          <li className="border-b py-3" key={c._id}>
            {c.certificateId} —{" "}
            {{
              PENDING: "Em análise",
              APPROVED: "Aprovado",
              REJECTED: "Não aprovado",
              REVOKED: "Vínculo removido",
            }[c.status] || c.status}
            {c.reason && <p>{c.reason}</p>}
          </li>
        ))}
      </ul>
    </section>
  );
}
