"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  FileSearch,
  FileText,
  LoaderCircle,
  RefreshCcw,
  SearchCheck,
  UserRound,
} from "lucide-react";
import {
  getProfileInitials,
  normalizeProfileName,
  readPanelProfile,
} from "@/app/panel/profile-storage";

type PanelCertificate = {
  _id: string;
  ownerName: string;
  eventName: string;
  certificateHours?: string;
  createdAt?: string;
  updatedAt?: string;
};

type LoadState = "idle" | "loading" | "ready" | "empty" | "error" | "missing-profile";

function formatCertificateDate(value?: string) {
  if (!value) return "Data nao informada";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Data nao informada";

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default function PanelCertificatesPage() {
  const [fullName, setFullName] = useState("");
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [certificates, setCertificates] = useState<PanelCertificate[]>([]);
  const [loadState, setLoadState] = useState<LoadState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const initials = useMemo(() => getProfileInitials(fullName), [fullName]);

  const loadCertificates = useCallback(async (profileName: string) => {
    const cleanName = normalizeProfileName(profileName);

    if (!cleanName) {
      setLoadState("missing-profile");
      setCertificates([]);
      return;
    }

    setLoadState("loading");
    setErrorMessage("");

    try {
      const response = await fetch(`/api/get/panelCertificates/${encodeURIComponent(cleanName)}`, {
        cache: "no-store",
      });
      const result: { data?: PanelCertificate[]; message?: string } = await response.json();

      if (response.status === 404) {
        setCertificates([]);
        setLoadState("empty");
        return;
      }

      if (!response.ok) {
        throw new Error(result.message ?? "Nao foi possivel buscar seus certificados.");
      }

      setCertificates(result.data ?? []);
      setLoadState((result.data ?? []).length > 0 ? "ready" : "empty");
    } catch (error) {
      setCertificates([]);
      setErrorMessage(error instanceof Error ? error.message : "Nao foi possivel buscar seus certificados.");
      setLoadState("error");
    }
  }, []);

  useEffect(() => {
    const profile = readPanelProfile();
    setFullName(profile.fullName);
    setPhotoDataUrl(profile.photoDataUrl);
    void loadCertificates(profile.fullName);
  }, [loadCertificates]);

  return (
    <main className="page-shell space-y-8 pb-8">
      <section className="glass-panel surface-outline overflow-hidden rounded-[32px] border border-white/70 p-6 sm:p-8 dark:border-white/10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border border-white/70 bg-[var(--brand-50)] shadow-[0_18px_40px_rgba(7,48,89,0.12)] dark:border-white/10 dark:bg-slate-900">
              {photoDataUrl ? (
                <img src={photoDataUrl} alt="Foto do perfil" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-[var(--brand-800)] dark:text-blue-100">
                  {initials}
                </div>
              )}
            </div>

            <div className="min-w-0">
              <span className="section-eyebrow">Certificados do painel</span>
              <h1 className="section-title !text-3xl sm:!text-5xl">Meus certificados</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
                {fullName
                  ? `Resultados vinculados ao nome completo: ${fullName}.`
                  : "Salve seu nome completo no perfil para carregar seus certificados."}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            <Link
              href="/panel"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[rgba(9,66,125,0.14)] bg-white px-5 text-sm font-semibold text-[var(--brand-900)] transition hover:border-[var(--brand-800)] dark:border-white/10 dark:bg-slate-900 dark:text-blue-100"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar ao perfil
            </Link>
            <button
              type="button"
              onClick={() => void loadCertificates(fullName)}
              disabled={!fullName || loadState === "loading"}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-[var(--brand-900)] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 dark:disabled:bg-slate-800"
            >
              <RefreshCcw className={`h-4 w-4 ${loadState === "loading" ? "animate-spin" : ""}`} />
              Atualizar
            </button>
          </div>
        </div>
      </section>

      {loadState === "loading" ? (
        <section
          role="status"
          aria-live="polite"
          className="rounded-[30px] border border-white/70 bg-white/90 p-8 text-center shadow-[0_18px_40px_rgba(7,48,89,0.08)] dark:border-white/10 dark:bg-slate-900/90"
        >
          <LoaderCircle className="mx-auto h-8 w-8 animate-spin text-[var(--brand-800)]" />
          <p className="mt-4 font-semibold text-slate-950 dark:text-white">Buscando certificados...</p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">A consulta usa somente o nome completo salvo no painel.</p>
        </section>
      ) : null}

      {loadState === "missing-profile" ? (
        <EmptyState
          icon={<UserRound className="h-7 w-7" />}
          title="Perfil incompleto"
          description="Salve seu nome completo no perfil para liberar a busca automatica."
          actionLabel="Editar perfil"
          actionHref="/panel"
        />
      ) : null}

      {loadState === "empty" ? (
        <EmptyState
          icon={<FileSearch className="h-7 w-7" />}
          title="Nenhum certificado encontrado"
          description="Confira se o nome completo esta escrito do mesmo jeito que foi usado nos eventos."
          actionLabel="Conferir perfil"
          actionHref="/panel"
        />
      ) : null}

      {loadState === "error" ? (
        <section
          role="alert"
          className="rounded-[30px] border border-red-100 bg-red-50 p-8 text-center text-red-800 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-100"
        >
          <p className="text-lg font-semibold">Nao foi possivel carregar os certificados.</p>
          <p className="mt-2 text-sm">{errorMessage}</p>
        </section>
      ) : null}

      {loadState === "ready" ? (
        <section className="glass-panel-strong surface-outline overflow-hidden rounded-[32px] border border-white/80 bg-white/95 p-4 shadow-[0_30px_90px_rgba(7,48,89,0.16)] dark:border-white/10 dark:bg-slate-950/95 sm:p-6">
          <div className="flex flex-col gap-3 border-b border-[rgba(9,66,125,0.10)] px-1 pb-5 sm:flex-row sm:items-end sm:justify-between dark:border-white/10">
            <div className="min-w-0">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
                Resultado
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">
                {certificates.length} {certificates.length === 1 ? "certificado encontrado" : "certificados encontrados"}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Certificados prontos encontrados para o nome salvo no seu perfil.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-50)] px-4 py-2 text-sm font-semibold text-[var(--brand-800)] dark:bg-white/10 dark:text-blue-100">
              <SearchCheck className="h-4 w-4" />
              Nome verificado
            </div>
          </div>

          <div className="mt-5 grid gap-4">
            {certificates.map((certificate) => (
              <Link
                key={String(certificate._id)}
                href={`/certificados/meuCertificado/${String(certificate._id)}`}
                className="group rounded-[26px] border border-[rgba(9,66,125,0.12)] bg-white p-5 shadow-[0_18px_44px_rgba(7,48,89,0.08)] transition hover:-translate-y-1 hover:border-[var(--brand-800)] hover:shadow-[0_24px_60px_rgba(7,48,89,0.14)] dark:border-white/10 dark:bg-slate-900 dark:hover:border-blue-300/40 dark:hover:shadow-[0_24px_60px_rgba(0,0,0,0.35)]"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 gap-4">
                    <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--brand-50)] text-[var(--brand-800)] dark:bg-white/10 dark:text-blue-100">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
                        Certificado
                      </p>
                      <h3 className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">{certificate.eventName}</h3>
                      <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-300">{certificate.ownerName}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:items-end">
                    <span className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition group-hover:bg-[var(--brand-900)]">
                      Abrir
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                    </span>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {certificate.certificateHours ? `${certificate.certificateHours} horas` : formatCertificateDate(certificate.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="mt-5 border-t border-[rgba(9,66,125,0.08)] pt-4 text-xs font-medium text-slate-500 dark:border-white/10 dark:text-slate-400">
                  Codigo verificador: <span className="break-all font-semibold text-slate-700 dark:text-slate-200">{String(certificate._id)}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}

function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
}) {
  return (
    <section className="rounded-[30px] border border-white/70 bg-white/90 p-8 text-center shadow-[0_18px_40px_rgba(7,48,89,0.08)] dark:border-white/10 dark:bg-slate-900/90">
      <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-[var(--brand-50)] text-[var(--brand-800)] dark:bg-white/10 dark:text-blue-100">
        {icon}
      </div>
      <h2 className="mt-5 text-2xl font-semibold text-slate-950 dark:text-white">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-300">{description}</p>
      <Link
        href={actionHref}
        className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-[var(--brand-900)]"
      >
        {actionLabel}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  );
}
