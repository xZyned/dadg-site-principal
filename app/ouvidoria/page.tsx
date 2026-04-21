"use client";

import type { FormEvent, ReactNode } from "react";
import { useState } from "react";
import { ArrowRight, MessageSquareQuote, Phone, Send, ShieldCheck, UserRound } from "lucide-react";
import { InfoCard, PageHero } from "@/app/components/site-sections";
import { cn } from "@/lib/utils";

const MIN_LENGTH = 20;
const MAX_LENGTH = 2000;
const MAX_NAME_LENGTH = 80;
const MIN_PHONE_DIGITS = 10;
const MAX_PHONE_DIGITS = 13;
const MIN_TURMA = 1;
const MAX_TURMA = 999;

const TOPIC_OPTIONS = [
  { value: "infraestrutura", label: "Infraestrutura" },
  { value: "problemas da turma", label: "Problemas da turma" },
  { value: "problemas com a coordenacao", label: "Problemas com a coordenação" },
  { value: "problemas com os professores", label: "Problemas com os professores" },
  { value: "certificados", label: "Certificados" },
] as const;

const CERTIFICADOS_TOPIC = "certificados";

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

function formatPhoneBR(value: string) {
  const digits = onlyDigits(value).slice(0, MAX_PHONE_DIGITS);

  if (!digits) return "";
  if (digits.length <= 2) return `(${digits}`;

  const ddd = digits.slice(0, 2);
  const rest = digits.slice(2);
  if (!rest) return `(${ddd})`;

  const prefixLen = rest.length >= 9 ? 5 : 4;
  const prefix = rest.slice(0, prefixLen);
  const suffix = rest.slice(prefixLen, prefixLen + 4);

  return suffix ? `(${ddd}) ${prefix}-${suffix}` : `(${ddd}) ${prefix}`;
}

export default function OuvidoriaPage() {
  const [topic, setTopic] = useState("");
  const [classNumber, setClassNumber] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [error, setError] = useState("");
  const [website, setWebsite] = useState("");
  const [showCertificadosPopup, setShowCertificadosPopup] = useState(false);

  const isCertificadosTopic = topic === CERTIFICADOS_TOPIC;

  function handleTopicClick(value: string) {
    if (value === CERTIFICADOS_TOPIC) {
      setShowCertificadosPopup(true);
    } else {
      setPhone("");
    }

    setTopic(value);
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setStatus("sending");
    setError("");

    if (!topic) {
      setStatus("error");
      setError("Selecione um tópico para continuar.");
      return;
    }

    if (topic === CERTIFICADOS_TOPIC && !name.trim()) {
      setStatus("error");
      setError("Para certificados, o nome completo é obrigatório.");
      return;
    }

    if (name.trim().length > MAX_NAME_LENGTH) {
      setStatus("error");
      setError(`Nome muito longo. Máximo de ${MAX_NAME_LENGTH} caracteres.`);
      return;
    }

    const turmaNum = parseInt(classNumber, 10);
    if (!Number.isFinite(turmaNum) || turmaNum < MIN_TURMA || turmaNum > MAX_TURMA) {
      setStatus("error");
      setError(`Turma inválida. Use um número entre ${MIN_TURMA} e ${MAX_TURMA}.`);
      return;
    }

    const phoneDigits = onlyDigits(phone);
    if (topic === CERTIFICADOS_TOPIC) {
      if (phoneDigits.length < MIN_PHONE_DIGITS || phoneDigits.length > MAX_PHONE_DIGITS) {
        setStatus("error");
        setError("Telefone inválido. Informe um número com DDD.");
        return;
      }
    } else if (phoneDigits && (phoneDigits.length < MIN_PHONE_DIGITS || phoneDigits.length > MAX_PHONE_DIGITS)) {
      setStatus("error");
      setError("Telefone inválido. Informe um número com DDD.");
      return;
    }

    if (message.length < MIN_LENGTH || message.length > MAX_LENGTH) {
      setStatus("error");
      setError(`Mensagem inválida. Mínimo de ${MIN_LENGTH} e máximo de ${MAX_LENGTH} caracteres.`);
      return;
    }

    const response = await fetch("/api/ouvidoria", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic,
        classNumber: turmaNum,
        name,
        phone,
        message,
        website,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok || !data.ok) {
      setStatus("error");
      setError(data?.error ?? "Não foi possível enviar.");
      return;
    }

    setStatus("ok");
    setTopic("");
    setClassNumber("");
    setName("");
    setPhone("");
    setMessage("");
    setWebsite("");
  }

  return (
    <div className="space-y-12 pb-8 sm:space-y-14">
      <PageHero
        eyebrow="Ouvidoria"
        title="Canal direto"
        description="Envie sua mensagem com clareza e escolha o tópico certo para o encaminhamento."
        aside={
          <div className="space-y-4">
            <InfoCard title="Quando usar" description="Sugestões, reclamações, problemas de turma, coordenação, professores ou certificados." />
            <InfoCard title="Privacidade" description="Envie apenas as informações necessárias para que o DADG consiga entender e encaminhar a demanda." />
          </div>
        }
      />

      <section className="page-shell grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="glass-panel surface-outline rounded-[32px] border border-white/70 p-6 sm:p-7">
          <form onSubmit={onSubmit} className="space-y-6">
            <input type="hidden" name="topic" value={topic} />

            <div className="hidden" aria-hidden>
              <label htmlFor="website">Website</label>
              <input
                id="website"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(event) => setWebsite(event.target.value)}
              />
            </div>

            <div className="space-y-3">
              <p id="ouvidoria-topic-label" className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                Tópico
              </p>
              <div className="grid gap-3 sm:grid-cols-2" aria-labelledby="ouvidoria-topic-label">
                {TOPIC_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleTopicClick(option.value)}
                    aria-pressed={topic === option.value}
                    className={cn(
                      "rounded-[22px] border px-4 py-4 text-left text-sm font-semibold transition",
                      topic === option.value
                        ? "border-[var(--brand-800)] bg-[rgba(9,66,125,0.08)] text-slate-950 dark:text-white"
                        : "border-[rgba(9,66,125,0.12)] bg-white/82 text-slate-700 hover:border-[rgba(9,66,125,0.2)] dark:border-white/10 dark:bg-slate-900/72 dark:text-slate-200"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Turma"
                htmlFor="ouvidoria-class-number"
                hint={classNumber ? `Turma ${classNumber}` : undefined}
              >
                <div className="relative">
                  <UserRound className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    id="ouvidoria-class-number"
                    name="classNumber"
                    type="number"
                    inputMode="numeric"
                    value={classNumber}
                    onChange={(event) => setClassNumber(event.target.value)}
                    min={MIN_TURMA}
                    max={MAX_TURMA}
                    required
                    placeholder="Ex.: 39"
                    className="h-14 w-full rounded-[20px] border border-[rgba(9,66,125,0.14)] bg-white/88 pl-12 pr-4 text-sm font-medium text-slate-800 outline-none transition focus:border-[var(--brand-800)] focus:ring-4 focus:ring-[rgba(9,66,125,0.08)] dark:border-white/10 dark:bg-slate-900/72 dark:text-slate-100"
                  />
                </div>
              </Field>

              <Field
                label={isCertificadosTopic ? "Nome completo" : "Nome"}
                htmlFor="ouvidoria-name"
                hint={`${name.trim().length} / ${MAX_NAME_LENGTH}`}
              >
                <div className="relative">
                  <UserRound className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    id="ouvidoria-name"
                    name="name"
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    maxLength={MAX_NAME_LENGTH}
                    placeholder={isCertificadosTopic ? "Digite seu nome completo" : "Opcional"}
                    autoComplete="name"
                    required={isCertificadosTopic}
                    className="h-14 w-full rounded-[20px] border border-[rgba(9,66,125,0.14)] bg-white/88 pl-12 pr-4 text-sm font-medium text-slate-800 outline-none transition focus:border-[var(--brand-800)] focus:ring-4 focus:ring-[rgba(9,66,125,0.08)] dark:border-white/10 dark:bg-slate-900/72 dark:text-slate-100"
                  />
                </div>
              </Field>
            </div>

            {isCertificadosTopic ? (
              <Field
                label="Telefone"
                htmlFor="ouvidoria-phone"
                hint={`${onlyDigits(phone).length} dígitos informados`}
              >
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    id="ouvidoria-phone"
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    value={phone}
                    onChange={(event) => setPhone(formatPhoneBR(event.target.value))}
                    placeholder="Ex.: (34) 99999-9999"
                    autoComplete="tel"
                    required
                    className="h-14 w-full rounded-[20px] border border-[rgba(9,66,125,0.14)] bg-white/88 pl-12 pr-4 text-sm font-medium text-slate-800 outline-none transition focus:border-[var(--brand-800)] focus:ring-4 focus:ring-[rgba(9,66,125,0.08)] dark:border-white/10 dark:bg-slate-900/72 dark:text-slate-100"
                  />
                </div>
              </Field>
            ) : null}

            <Field label="Mensagem" htmlFor="ouvidoria-message" hint={`${message.length} / ${MAX_LENGTH}`}>
              <textarea
                id="ouvidoria-message"
                name="message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                rows={8}
                minLength={MIN_LENGTH}
                maxLength={MAX_LENGTH}
                required
                placeholder="Descreva sua mensagem com clareza."
                className="w-full rounded-[24px] border border-[rgba(9,66,125,0.14)] bg-white/88 px-4 py-4 text-sm font-medium text-slate-800 outline-none transition focus:border-[var(--brand-800)] focus:ring-4 focus:ring-[rgba(9,66,125,0.08)] dark:border-white/10 dark:bg-slate-900/72 dark:text-slate-100"
              />
            </Field>

            <button
              type="submit"
              disabled={status === "sending"}
              className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-slate-950 px-6 text-sm font-semibold text-white hover:bg-[var(--brand-900)] disabled:opacity-70"
            >
              {status === "sending" ? "Enviando..." : "Enviar mensagem"}
              {status === "sending" ? <Send className="h-4 w-4 animate-pulse" /> : <ArrowRight className="h-4 w-4" />}
            </button>

            {status === "ok" ? (
              <div
                role="status"
                aria-live="polite"
                className="rounded-[22px] border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm font-medium text-emerald-700"
              >
                Mensagem enviada com sucesso.
              </div>
            ) : null}

            {status === "error" ? (
              <div
                role="alert"
                aria-live="assertive"
                className="rounded-[22px] border border-rose-200 bg-rose-50 px-4 py-4 text-sm font-medium text-rose-700"
              >
                {error}
              </div>
            ) : null}
          </form>
        </div>

        <div className="space-y-5">
          <InfoCard title="Envio correto" description="Escolha o tópico mais próximo da sua demanda para facilitar o encaminhamento." />
          <InfoCard title="Para certificados" description="Nome completo e telefone são obrigatórios quando o tópico for certificados.">
            <div className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-50)] px-3 py-2 text-sm font-semibold text-[var(--brand-800)]">
              <ShieldCheck className="h-4 w-4" />
              Informações completas
            </div>
          </InfoCard>
          <InfoCard title="Mensagem objetiva" description={`Informe o contexto e os detalhes essenciais. Mínimo de ${MIN_LENGTH} caracteres.`}>
            <div className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-50)] px-3 py-2 text-sm font-semibold text-[var(--brand-800)]">
              <MessageSquareQuote className="h-4 w-4" />
              Clareza ajuda no retorno
            </div>
          </InfoCard>
        </div>
      </section>

      {showCertificadosPopup ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm">
          <div className="glass-panel-strong w-full max-w-md rounded-[28px] border border-white/80 p-6 shadow-[0_30px_80px_rgba(4,26,49,0.24)] dark:border-white/10">
            <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">Tópico certificados</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
              Para esse tópico, informe nome completo e telefone para facilitar o contato, se necessário.
            </p>
            <button
              type="button"
              onClick={() => setShowCertificadosPopup(false)}
              className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-slate-950 px-5 text-sm font-semibold text-white hover:bg-[var(--brand-900)]"
            >
              Entendi
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

type FieldProps = {
  label: string;
  htmlFor: string;
  hint?: string;
  children: ReactNode;
};

function Field({ label, htmlFor, hint, children }: FieldProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={htmlFor} className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
          {label}
        </label>
        {hint ? <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">{hint}</span> : null}
      </div>
      {children}
    </div>
  );
}
