"use client";

import type { ChangeEvent, FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Camera,
  CheckCircle2,
  FileText,
  IdCard,
  LogOut,
  Save,
  ShieldCheck,
  Upload,
  UserRound,
  X,
} from "lucide-react";
import {
  getProfileInitials,
  normalizeProfileName,
  readPanelProfile,
  savePanelProfile,
} from "@/app/panel/profile-storage";

const MAX_PHOTO_SIZE = 6 * 1024 * 1024;

function resizeProfilePhoto(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error("Nao foi possivel ler a imagem."));
    reader.onload = () => {
      const image = new Image();

      image.onerror = () => reject(new Error("Nao foi possivel carregar a imagem."));
      image.onload = () => {
        const maxSize = 640;
        const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
        const width = Math.max(1, Math.round(image.width * scale));
        const height = Math.max(1, Math.round(image.height * scale));
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (!context) {
          reject(new Error("Nao foi possivel processar a imagem."));
          return;
        }

        canvas.width = width;
        canvas.height = height;
        context.drawImage(image, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.86));
      };

      image.src = String(reader.result);
    };

    reader.readAsDataURL(file);
  });
}

export default function DashboardPage() {
  const [fullName, setFullName] = useState("");
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [savedFullName, setSavedFullName] = useState("");
  const [saveState, setSaveState] = useState<"idle" | "saved" | "missing-name">("idle");
  const [photoError, setPhotoError] = useState("");

  useEffect(() => {
    const profile = readPanelProfile();
    setFullName(profile.fullName);
    setSavedFullName(profile.fullName);
    setPhotoDataUrl(profile.photoDataUrl);
  }, []);

  const cleanFullName = useMemo(() => normalizeProfileName(fullName), [fullName]);
  const nameHasUnsavedChange = cleanFullName !== savedFullName;
  const profileIsReady = savedFullName.length > 0 && !nameHasUnsavedChange;
  const initials = getProfileInitials(cleanFullName || savedFullName);

  async function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setPhotoError("");

    if (!file.type.startsWith("image/")) {
      setPhotoError("Escolha um arquivo de imagem.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_PHOTO_SIZE) {
      setPhotoError("Use uma imagem de ate 6 MB.");
      event.target.value = "";
      return;
    }

    try {
      const resizedPhoto = await resizeProfilePhoto(file);
      setPhotoDataUrl(resizedPhoto);
    } catch {
      setPhotoError("Nao foi possivel carregar essa foto.");
    } finally {
      event.target.value = "";
    }
  }

  function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!cleanFullName) {
      setSaveState("missing-name");
      return;
    }

    savePanelProfile({
      fullName: cleanFullName,
      photoDataUrl,
      updatedAt: new Date().toISOString(),
    });

    setFullName(cleanFullName);
    setSavedFullName(cleanFullName);
    setSaveState("saved");
  }

  return (
    <main className="page-shell space-y-8 pb-8">
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-stretch">
        <form
          onSubmit={handleSave}
          className="glass-panel surface-outline relative overflow-hidden rounded-[32px] border border-white/70 p-6 sm:p-8 dark:border-white/10"
        >
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[var(--brand-900)] via-[var(--brand-500)] to-[var(--gold-400)]" />

          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <span className="section-eyebrow">Painel do estudante</span>
              <h1 className="section-title !text-3xl sm:!text-5xl">Meu perfil</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
                Cadastre seu nome completo como aparece nos certificados para reunir seus documentos em um so lugar.
              </p>
            </div>

            <a
              href="/auth/logout"
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full border border-red-100 bg-red-50 px-4 text-sm font-semibold text-red-700 transition hover:bg-red-100 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </a>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
            <div className="rounded-[28px] border border-white/70 bg-white/72 p-4 shadow-[0_18px_40px_rgba(7,48,89,0.08)] dark:border-white/10 dark:bg-slate-950/40">
              <div className="relative mx-auto h-40 w-40 overflow-hidden rounded-full border border-[rgba(9,66,125,0.12)] bg-[var(--brand-50)] shadow-inner dark:border-white/10 dark:bg-slate-900">
                {photoDataUrl ? (
                  <img src={photoDataUrl} alt="Foto do perfil" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-4xl font-semibold text-[var(--brand-800)] dark:text-blue-100">
                    {initials}
                  </div>
                )}
              </div>

              <div className="mt-4 grid gap-3">
                <label
                  htmlFor="profile-photo"
                  className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-[var(--brand-900)]"
                >
                  <Upload className="h-4 w-4" />
                  Escolher foto
                </label>
                <input id="profile-photo" type="file" accept="image/*" className="sr-only" onChange={handlePhotoChange} />

                {photoDataUrl ? (
                  <button
                    type="button"
                    onClick={() => setPhotoDataUrl(null)}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[rgba(9,66,125,0.14)] bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-[var(--brand-800)] dark:border-white/10 dark:bg-slate-900 dark:text-slate-200"
                  >
                    <X className="h-4 w-4" />
                    Remover
                  </button>
                ) : null}
              </div>

              {photoError ? <p className="mt-3 text-sm font-medium text-red-600 dark:text-red-300">{photoError}</p> : null}
            </div>

            <div className="flex min-w-0 flex-col justify-between gap-6">
              <div>
                <label htmlFor="full-name" className="text-sm font-semibold text-slate-900 dark:text-white">
                  Nome completo
                </label>
                <div className="relative mt-3">
                  <UserRound className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    id="full-name"
                    name="fullName"
                    type="text"
                    value={fullName}
                    onChange={(event) => {
                      setFullName(event.target.value);
                      setSaveState("idle");
                    }}
                    className="h-14 w-full rounded-full border border-[rgba(9,66,125,0.14)] bg-white pl-12 pr-4 text-sm font-semibold text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-[var(--brand-800)] focus:ring-4 focus:ring-[rgba(9,66,125,0.08)] dark:border-white/10 dark:bg-white dark:text-slate-950"
                    placeholder="Ex.: Maria Eduarda Souza"
                    autoComplete="name"
                  />
                </div>

                <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Use o mesmo nome informado nos eventos. A busca dos certificados sera feita por esse campo.
                </p>

                {saveState === "missing-name" ? (
                  <p className="mt-3 text-sm font-semibold text-red-600 dark:text-red-300">Informe seu nome completo antes de salvar.</p>
                ) : null}

                {saveState === "saved" ? (
                  <p className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[var(--green-700)] dark:text-emerald-300">
                    <CheckCircle2 className="h-4 w-4" />
                    Perfil salvo.
                  </p>
                ) : null}

                {saveState === "idle" && savedFullName && nameHasUnsavedChange ? (
                  <p className="mt-3 text-sm font-semibold text-[var(--brand-800)] dark:text-blue-200">
                    Salve o novo nome para atualizar a busca dos certificados.
                  </p>
                ) : null}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-[var(--brand-900)]"
                >
                  <Save className="h-4 w-4" />
                  Salvar perfil
                </button>

                {profileIsReady ? (
                  <Link
                    href="/panel/certificados"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[rgba(9,66,125,0.14)] bg-white px-5 text-sm font-semibold text-[var(--brand-900)] transition hover:border-[var(--brand-800)] dark:border-white/10 dark:bg-slate-900 dark:text-blue-100"
                  >
                    Ver meus certificados
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="inline-flex h-12 cursor-not-allowed items-center justify-center gap-2 rounded-full border border-slate-200 bg-white/70 px-5 text-sm font-semibold text-slate-400 dark:border-white/10 dark:bg-slate-900/50"
                  >
                    Ver meus certificados
                    <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>

        <aside className="glass-panel surface-outline flex flex-col justify-between rounded-[32px] border border-white/70 p-6 dark:border-white/10">
          <div>
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-50)] text-[var(--brand-800)] dark:bg-white/10 dark:text-blue-100">
              <IdCard className="h-5 w-5" />
            </div>
            <h2 className="mt-5 text-2xl font-semibold text-slate-950 dark:text-white">Seu acesso rapido</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              Depois de salvar o perfil, o painel usa seu nome completo para procurar certificados prontos automaticamente.
            </p>
          </div>

          <div className="mt-8 space-y-3">
            <div className="rounded-[24px] border border-white/70 bg-white/72 p-4 dark:border-white/10 dark:bg-slate-950/40">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Nome ativo</p>
              <p className="mt-2 text-base font-semibold text-slate-950 dark:text-white">{savedFullName || "Perfil ainda nao salvo"}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-[22px] border border-white/70 bg-white/72 p-4 dark:border-white/10 dark:bg-slate-950/40">
                <Camera className="h-5 w-5 text-[var(--brand-800)] dark:text-blue-100" />
                <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">Foto</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{photoDataUrl ? "Adicionada" : "Opcional"}</p>
              </div>
              <div className="rounded-[22px] border border-white/70 bg-white/72 p-4 dark:border-white/10 dark:bg-slate-950/40">
                <ShieldCheck className="h-5 w-5 text-[var(--green-700)] dark:text-emerald-300" />
                <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">Busca</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{profileIsReady ? "Pronta" : "Pendente"}</p>
              </div>
            </div>
          </div>
        </aside>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Link
          href={profileIsReady ? "/panel/certificados" : "/panel"}
          className="group rounded-[28px] border border-white/70 bg-white/78 p-6 shadow-[0_18px_40px_rgba(7,48,89,0.08)] transition hover:-translate-y-1 hover:border-[var(--brand-800)] dark:border-white/10 dark:bg-slate-900/72"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-50)] text-[var(--brand-800)] dark:bg-white/10 dark:text-blue-100">
              <FileText className="h-5 w-5" />
            </div>
            <ArrowRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-[var(--brand-800)]" />
          </div>
          <h2 className="mt-5 text-xl font-semibold text-slate-950 dark:text-white">Meus certificados</h2>
          <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
            Lista filtrada pelo nome completo salvo no seu perfil.
          </p>
        </Link>

        <Link
          href="/eventos"
          className="group rounded-[28px] border border-white/70 bg-white/78 p-6 shadow-[0_18px_40px_rgba(7,48,89,0.08)] transition hover:-translate-y-1 hover:border-[var(--brand-800)] dark:border-white/10 dark:bg-slate-900/72"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-[var(--green-700)] dark:bg-white/10 dark:text-emerald-300">
              <CalendarDays className="h-5 w-5" />
            </div>
            <ArrowRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-[var(--brand-800)]" />
          </div>
          <h2 className="mt-5 text-xl font-semibold text-slate-950 dark:text-white">Eventos</h2>
          <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
            Acompanhe atividades, jornadas, cursos e oportunidades abertas.
          </p>
        </Link>
      </section>
    </main>
  );
}
