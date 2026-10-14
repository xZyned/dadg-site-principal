"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileUp, Info, LoaderCircle, Pencil, Trash2 } from "lucide-react";

type DadgItem = {
  certificateId: string;
  eventName: string;
  officialHoursText: string;
  officialHours: number | null;
  note: { type: string | null; hours: number | null } | null;
};
type ExternalItem = {
  id: string;
  title: string;
  type: string;
  institution: string;
  date: string;
  hours: number;
  fileSize: number;
};
type Organizer = {
  types: Record<string, string>;
  dadg: DadgItem[];
  external: ExternalItem[];
  totals: { byType: Record<string, number>; total: number; unknownHours: number };
  usage: { bytes: number; files: number; quotaBytes: number; quotaFiles: number };
};
type Fields = { title: string; type: string; institution: string; date: string; hours: string };

const DISCLAIMER =
  "As informações deste organizador são preenchidas por você. O DADG não verifica nem se responsabiliza por dados incorretos. Para fins oficiais, valem os certificados emitidos e a carga horária registrada pelo DADG.";
const eyebrow = "text-xs font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400";
const panel = "glass-panel surface-outline rounded-[32px] border border-white/70 p-6 sm:p-7 dark:border-white/10";
const inputClass =
  "mt-2 w-full rounded-2xl border border-white/70 bg-white/85 px-4 py-3 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-blue-600 dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-100";
const labelClass = "block text-sm font-semibold text-slate-700 dark:text-slate-200";
const primaryButton =
  "inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-900)] disabled:opacity-70 dark:bg-blue-600 dark:hover:bg-blue-500";
const ghostButton =
  "inline-flex items-center gap-1.5 rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 disabled:opacity-60 dark:border-white/15 dark:text-slate-200";

const hoursFmt = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 });
const mb = (bytes: number) => new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 }).format(bytes / 1048576);
const dateFmt = (value: string) => (value ? value.split("-").reverse().join("/") : "");
const emptyFields: Fields = { title: "", type: "curso", institution: "", date: "", hours: "" };

async function send(url: string, init: RequestInit) {
  const response = await fetch(url, init);
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || "Não foi possível concluir. Tente novamente.");
  return body;
}

export default function MyHours() {
  const [data, setData] = useState<Organizer | null>(null);
  const [loadError, setLoadError] = useState("");
  const [feedback, setFeedback] = useState<{ text: string; failed: boolean } | null>(null);
  const [busy, setBusy] = useState(false);
  const [fields, setFields] = useState<Fields>(emptyFields);
  const [file, setFile] = useState<File | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [editing, setEditing] = useState<{ id: string; fields: Fields } | null>(null);
  const [noteEditing, setNoteEditing] = useState<{ id: string; type: string; hours: string } | null>(null);

  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/v1/user/organizer");
      const body = await response.json().catch(() => ({}));
      if (response.status === 401) throw new Error("Entre na sua conta para ver suas horas.");
      if (response.status === 428) throw new Error("Complete seu perfil para usar o organizador.");
      if (!response.ok) throw new Error(body.error || "Não foi possível carregar o organizador.");
      setData(body as Organizer);
      setLoadError("");
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Falha de conexão.");
    }
  }, []);
  useEffect(() => {
    void load();
  }, [load]);

  async function run(action: () => Promise<unknown>, success: string) {
    setBusy(true);
    setFeedback(null);
    try {
      await action();
      setFeedback({ text: success, failed: false });
      await load();
      return true;
    } catch (error) {
      setFeedback({ text: error instanceof Error ? error.message : "Falha de conexão.", failed: true });
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function upload(event: FormEvent) {
    event.preventDefault();
    if (!file) return setFeedback({ text: "Escolha o PDF do certificado.", failed: true });
    const form = new FormData();
    form.set("file", file);
    for (const [key, value] of Object.entries(fields)) form.set(key, value);
    const ok = await run(() => send("/api/v1/user/organizer/uploads", { method: "POST", body: form }), "Certificado enviado.");
    if (ok) {
      setFields(emptyFields);
      setFile(null);
      setFileInputKey((key) => key + 1);
    }
  }

  async function openFile(id: string) {
    try {
      const { url } = await send(`/api/v1/user/organizer/uploads/${id}/file`, {});
      window.open(url, "_blank", "noopener");
    } catch (error) {
      setFeedback({ text: error instanceof Error ? error.message : "Falha de conexão.", failed: true });
    }
  }

  const typeLabel = (type: string | null | undefined) => (type && data?.types[type]) || "Evento";
  const typeOptions = data ? Object.entries(data.types) : [];
  const fieldInputs = (value: Fields, change: (next: Fields) => void, prefix: string) => (
    <div className="grid gap-4 sm:grid-cols-2">
      <label className={`${labelClass} sm:col-span-2`} htmlFor={`${prefix}-title`}>
        Título
        <input id={`${prefix}-title`} required minLength={3} maxLength={150} value={value.title} onChange={(e) => change({ ...value, title: e.target.value })} className={inputClass} />
      </label>
      <label className={labelClass} htmlFor={`${prefix}-type`}>
        Tipo
        <select id={`${prefix}-type`} value={value.type} onChange={(e) => change({ ...value, type: e.target.value })} className={inputClass}>
          {typeOptions.map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <label className={labelClass} htmlFor={`${prefix}-hours`}>
        Horas
        <input id={`${prefix}-hours`} required inputMode="decimal" pattern="\d{1,4}([.,]\d)?" value={value.hours} onChange={(e) => change({ ...value, hours: e.target.value })} className={inputClass} />
      </label>
      <label className={labelClass} htmlFor={`${prefix}-institution`}>
        Instituição (opcional)
        <input id={`${prefix}-institution`} maxLength={150} value={value.institution} onChange={(e) => change({ ...value, institution: e.target.value })} className={inputClass} />
      </label>
      <label className={labelClass} htmlFor={`${prefix}-date`}>
        Data (opcional)
        <input id={`${prefix}-date`} type="date" value={value.date} onChange={(e) => change({ ...value, date: e.target.value })} className={inputClass} />
      </label>
    </div>
  );

  return (
    <main className="space-y-9 pt-28 pb-12">
      <div className="page-shell space-y-5">
        <Link href="/perfil" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-300">
          <ArrowLeft className="h-4 w-4" />
          Voltar ao perfil
        </Link>
        <div>
          <p className={eyebrow}>Área do aluno</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">Minhas horas</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
            Reúna seus certificados do DADG e de outros lugares e acompanhe o total de horas por tipo.
          </p>
        </div>
        <p role="note" className="flex max-w-3xl gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
          <Info className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          {DISCLAIMER}
        </p>
        {feedback ? (
          <p role={feedback.failed ? "alert" : "status"} className={`text-sm font-semibold ${feedback.failed ? "text-red-600 dark:text-red-300" : "text-emerald-700 dark:text-emerald-300"}`}>
            {feedback.text}
          </p>
        ) : null}
      </div>

      {loadError ? (
        <div className="page-shell">
          <div className={panel}>
            <p className="text-sm text-slate-700 dark:text-slate-200">{loadError}</p>
          </div>
        </div>
      ) : !data ? (
        <div className="page-shell flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300" role="status">
          <LoaderCircle className="h-4 w-4 animate-spin" /> Carregando suas horas...
        </div>
      ) : (
        <>
          <section className="page-shell" aria-labelledby="totais">
            <div className={panel}>
              <p className={eyebrow}>Resumo</p>
              <h2 id="totais" className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">
                {hoursFmt.format(data.totals.total)} horas no total
              </h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {Object.entries(data.totals.byType).map(([type, hours]) => (
                  <li key={type} className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-800 dark:bg-blue-500/10 dark:text-blue-200">
                    {typeLabel(type)}: {hoursFmt.format(hours)} h
                  </li>
                ))}
              </ul>
              {data.totals.unknownHours > 0 ? (
                <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                  {data.totals.unknownHours} certificado(s) sem carga horária legível não entram na soma. Informe as horas deles abaixo.
                </p>
              ) : null}
            </div>
          </section>

          <section className="page-shell grid gap-6 lg:grid-cols-2">
            <form className={`${panel} space-y-5`} onSubmit={(event) => void upload(event)}>
              <div>
                <p className={eyebrow}>Outros certificados</p>
                <h2 className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">Enviar certificado</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  Só PDF, até 4 MB. Certificados do DADG já aparecem aqui sozinhos, não precisa enviar.
                </p>
              </div>
              <label className={labelClass} htmlFor="upload-file">
                Arquivo PDF
                <input
                  key={fileInputKey}
                  id="upload-file"
                  type="file"
                  accept="application/pdf"
                  required
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className={inputClass}
                />
              </label>
              {fieldInputs(fields, setFields, "upload")}
              <button disabled={busy} className={primaryButton}>
                {busy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <FileUp className="h-4 w-4" />}
                Enviar
              </button>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Espaço usado: {mb(data.usage.bytes)} de {mb(data.usage.quotaBytes)} MB · {data.usage.files} de {data.usage.quotaFiles} arquivos
              </p>
            </form>

            <div className={panel}>
              <p className={eyebrow}>Enviados por você</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">Certificados de fora do DADG</h2>
              {data.external.length === 0 ? (
                <p className="mt-5 text-sm text-slate-600 dark:text-slate-300">Nenhum certificado enviado ainda.</p>
              ) : (
                <ul className="mt-5 space-y-4">
                  {data.external.map((item) =>
                    editing?.id === item.id ? (
                      <li key={item.id} className="rounded-2xl border border-slate-200 p-4 dark:border-white/10">
                        <form
                          className="space-y-4"
                          onSubmit={(event) => {
                            event.preventDefault();
                            void run(
                              () =>
                                send(`/api/v1/user/organizer/uploads/${item.id}`, {
                                  method: "PATCH",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify(editing.fields),
                                }),
                              "Alterações salvas.",
                            ).then((ok) => ok && setEditing(null));
                          }}
                        >
                          {fieldInputs(editing.fields, (next) => setEditing({ id: item.id, fields: next }), `edit-${item.id}`)}
                          <div className="flex gap-2">
                            <button disabled={busy} className={primaryButton}>Salvar</button>
                            <button type="button" onClick={() => setEditing(null)} className={ghostButton}>Cancelar</button>
                          </div>
                        </form>
                      </li>
                    ) : (
                      <li key={item.id} className="rounded-2xl border border-slate-200 p-4 dark:border-white/10">
                        <p className="font-semibold text-slate-900 dark:text-white">{item.title}</p>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                          {typeLabel(item.type)} · {hoursFmt.format(item.hours)} h
                          {item.institution ? ` · ${item.institution}` : ""}
                          {item.date ? ` · ${dateFmt(item.date)}` : ""}
                        </p>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Enviado por você, não verificado pelo DADG</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <button type="button" onClick={() => void openFile(item.id)} className={ghostButton}>Abrir PDF</button>
                          <button
                            type="button"
                            onClick={() =>
                              setEditing({
                                id: item.id,
                                fields: { title: item.title, type: item.type, institution: item.institution, date: item.date, hours: String(item.hours).replace(".", ",") },
                              })
                            }
                            className={ghostButton}
                          >
                            <Pencil className="h-3.5 w-3.5" /> Editar
                          </button>
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => {
                              if (!confirm(`Excluir "${item.title}"? O PDF será apagado.`)) return;
                              void run(() => send(`/api/v1/user/organizer/uploads/${item.id}`, { method: "DELETE" }), "Certificado excluído.");
                            }}
                            className={ghostButton}
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Excluir
                          </button>
                        </div>
                      </li>
                    ),
                  )}
                </ul>
              )}
            </div>
          </section>

          <section className="page-shell" aria-labelledby="certificados-dadg">
            <div className={panel}>
              <p className={eyebrow}>Emitidos pelo DADG</p>
              <h2 id="certificados-dadg" className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">Certificados do DADG</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                Você pode classificar cada um e ajustar as horas que entram na sua soma. O certificado oficial não muda.
              </p>
              {data.dadg.length === 0 ? (
                <p className="mt-5 text-sm text-slate-600 dark:text-slate-300">
                  Nenhum certificado do DADG na sua conta. Veja em{" "}
                  <Link href="/perfil/certificados" className="font-semibold text-blue-600 underline dark:text-blue-300">Meus certificados</Link>.
                </p>
              ) : (
                <ul className="mt-5 divide-y divide-slate-200 dark:divide-white/10">
                  {data.dadg.map((item) => (
                    <li key={item.certificateId} className="py-4">
                      <p className="font-semibold text-slate-900 dark:text-white">{item.eventName}</p>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                        Carga horária oficial: {item.officialHoursText || "não informada"}
                        {item.note?.hours != null ? ` · Você contabilizou: ${hoursFmt.format(item.note.hours)} h` : ""}
                        {` · Tipo: ${typeLabel(item.note?.type)}`}
                      </p>
                      {noteEditing?.id === item.certificateId ? (
                        <form
                          className="mt-3 grid gap-3 sm:grid-cols-[1fr_8rem_auto] sm:items-end"
                          onSubmit={(event) => {
                            event.preventDefault();
                            void run(
                              () =>
                                send(`/api/v1/user/organizer/notes/${item.certificateId}`, {
                                  method: "PUT",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ type: noteEditing.type, hours: noteEditing.hours }),
                                }),
                              "Anotação salva.",
                            ).then((ok) => ok && setNoteEditing(null));
                          }}
                        >
                          <label className={labelClass} htmlFor={`note-type-${item.certificateId}`}>
                            Tipo
                            <select id={`note-type-${item.certificateId}`} value={noteEditing.type} onChange={(e) => setNoteEditing({ ...noteEditing, type: e.target.value })} className={inputClass}>
                              {typeOptions.map(([key, label]) => (
                                <option key={key} value={key}>{label}</option>
                              ))}
                            </select>
                          </label>
                          <label className={labelClass} htmlFor={`note-hours-${item.certificateId}`}>
                            Horas
                            <input
                              id={`note-hours-${item.certificateId}`}
                              inputMode="decimal"
                              pattern="\d{1,4}([.,]\d)?"
                              placeholder={item.officialHours != null ? hoursFmt.format(item.officialHours) : ""}
                              value={noteEditing.hours}
                              onChange={(e) => setNoteEditing({ ...noteEditing, hours: e.target.value })}
                              className={inputClass}
                            />
                          </label>
                          <div className="flex gap-2">
                            <button disabled={busy} className={primaryButton}>Salvar</button>
                            <button type="button" onClick={() => setNoteEditing(null)} className={ghostButton}>Cancelar</button>
                          </div>
                        </form>
                      ) : (
                        <div className="mt-2 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setNoteEditing({
                                id: item.certificateId,
                                type: item.note?.type || "evento",
                                hours: item.note?.hours != null ? String(item.note.hours).replace(".", ",") : "",
                              })
                            }
                            className={ghostButton}
                          >
                            <Pencil className="h-3.5 w-3.5" /> Editar tipo e horas
                          </button>
                          {item.note ? (
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => void run(() => send(`/api/v1/user/organizer/notes/${item.certificateId}`, { method: "DELETE" }), "Voltou a usar a carga oficial.")}
                              className={ghostButton}
                            >
                              Usar a carga oficial
                            </button>
                          ) : null}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </>
      )}
    </main>
  );
}
