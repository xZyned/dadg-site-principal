"use client";

import Image from "next/image";
import Link from "next/link";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Loader2,
  LogOut,
  Mail,
  MapPin,
  QrCode,
  User,
  XCircle,
} from "lucide-react";
import BlogCard, { BlogPostData } from "@/app/components/BlogCard";
import LocalQrCode from "@/app/components/profile/LocalQrCode";
import PersonalDataPanel, {
  type OwnProfile,
  type PrivacyNotice,
} from "@/app/components/profile/PersonalDataPanel";
import { InfoCard, PageHero } from "@/app/components/site-sections";
import { useUserContext } from "@/lib/userProvider";
import { profileReturnTo } from "@/lib/profile/return-to";

interface EventHistory {
  participationStatus?: string;
  paymentUrl?: string;
  canCancel?: boolean;
  isPaid?: boolean;
  participationId: string;
  eventId: string;
  eventName: string;
  eventDescription: string;
  eventType: string;
  status: string;
  isOpen: boolean;
  enrolledAt: string;
  certificateId: string | null;
  qrToken: string | null;
  checkedIn: boolean;
  checkedInAt: string | null;
  certificateReleased: boolean;
}
interface Account {
  email: string;
  picture: string;
  suggestedName: string;
}
interface ProfileData {
  account: Account;
  profile: OwnProfile;
  privacyNotice: PrivacyNotice;
  events: EventHistory[];
}
type Tab = "dados" | "eventos" | "artigos";

function safeReturnTo() {
  if (typeof window === "undefined") return null;
  const value = new URLSearchParams(window.location.search).get("returnTo");
  return profileReturnTo(value, window.location.origin);
}
export default function PerfilPage() {
  const bookmarksStarted = useRef(false);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const { updateProfileSummary } = useUserContext();
  const [data, setData] = useState<ProfileData | null>(null);
  const [savedArticles, setSavedArticles] = useState<BlogPostData[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("dados");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [blogEnabled, setBlogEnabled] = useState(true);
  const [returnTo] = useState<string | null>(() => safeReturnTo());

  const load = async () => {
    setIsLoading(true);
    setError("");
    try {
      const [profileResponse, settingsResponse] = await Promise.all([
        fetch("/api/perfil/proxy", { cache: "no-store" }),
        fetch("/api/settings", { cache: "no-store" }),
      ]);
      const profile = await profileResponse.json();
      if (profileResponse.status === 401) {
        // Um unico reenvio ao login. Se o 401 persistir depois de autenticar, o
        // problema esta na validacao do token no backend: mostrar o motivo em
        // vez de entrar em ciclo infinito de redirecionamento.
        if (!sessionStorage.getItem("perfil:auth-retry")) {
          sessionStorage.setItem("perfil:auth-retry", "1");
          window.location.href = "/api/auth/login?returnTo=/perfil";
          return;
        }
        sessionStorage.removeItem("perfil:auth-retry");
        const detail = [profile.code, profile.reason]
          .filter(Boolean)
          .join(" / ");
        throw new Error(
          `Sua sessao foi aceita, mas o servidor recusou a credencial${detail ? ` (${detail})` : ""}. Saia e entre novamente; se persistir, avise a coordenacao.`,
        );
      }
      sessionStorage.removeItem("perfil:auth-retry");
      if (!profileResponse.ok)
        throw new Error(profile.error || "Não foi possível carregar o perfil.");
      setData(profile);
      const settings = settingsResponse.ok
        ? await settingsResponse.json()
        : { blogEnabled: true };
      setBlogEnabled(settings.blogEnabled !== false);
      updateProfileSummary({
        displayName: profile.profile?.name?.trim() || "Aluno DADG",
        complete: Boolean(profile.profile?.complete),
        privacyNoticeRequired: Boolean(profile.profile?.privacyNoticeRequired),
      });
    } catch (caught) {
      setError((caught as Error).message || "Erro ao carregar perfil.");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    void load();
  }, []);
  useEffect(() => {
    if (activeTab !== "artigos" || !blogEnabled || bookmarksStarted.current)
      return;
    bookmarksStarted.current = true;
    fetch("/api/v1/blog/proxy/bookmarks", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { data: [] }))
      .then((value) => setSavedArticles(value.data || []))
      .catch(() => setSavedArticles([]));
  }, [activeTab, blogEnabled]);

  const tabs: Tab[] = blogEnabled
    ? ["dados", "eventos", "artigos"]
    : ["dados", "eventos"];
  const selectTab = (tab: Tab) => {
    setActiveTab(tab);
    tabRefs.current[tab]?.focus();
  };
  const keyboard = (event: KeyboardEvent<HTMLButtonElement>, tab: Tab) => {
    const index = tabs.indexOf(tab);
    if (event.key === "ArrowRight") {
      event.preventDefault();
      selectTab(tabs[(index + 1) % tabs.length]);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      selectTab(tabs[(index - 1 + tabs.length) % tabs.length]);
    }
    if (event.key === "Home") {
      event.preventDefault();
      selectTab(tabs[0]);
    }
    if (event.key === "End") {
      event.preventDefault();
      selectTab(tabs[tabs.length - 1]);
    }
  };

  if (isLoading)
    return (
      <main className="space-y-8 pt-28 pb-12">
        <section className="page-shell">
          <div className="glass-panel surface-outline rounded-[28px] border border-white/70 p-10 text-center dark:border-white/10">
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-blue-600" />
            <p className="mt-4 font-medium text-slate-600 dark:text-slate-300">
              Carregando seu perfil...
            </p>
          </div>
        </section>
      </main>
    );
  if (error || !data)
    return (
      <main className="space-y-8 pt-28 pb-12">
        <section className="page-shell">
          <div className="glass-panel surface-outline rounded-[28px] border border-white/70 p-10 text-center dark:border-white/10">
            <XCircle className="mx-auto h-10 w-10 text-rose-500" />
            <p role="alert" className="mt-4 text-slate-700 dark:text-slate-200">
              {error || "Perfil indisponível."}
            </p>
            <button
              onClick={() => void load()}
              className="mt-5 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white dark:bg-blue-600"
            >
              Tentar novamente
            </button>
          </div>
        </section>
      </main>
    );

  const active = data.events.filter((event) => event.isOpen);
  const displayName = data.profile.name?.trim() || "Aluno DADG";
  const saved = (
    profile: OwnProfile,
    summary: {
      displayName: string;
      complete: boolean;
      privacyNoticeRequired: boolean;
    },
  ) => {
    setData((current) => (current ? { ...current, profile } : current));
    updateProfileSummary(summary);
  };
  const cancelSuccess = (eventId: string) =>
    setData((current) =>
      current
        ? {
            ...current,
            events: current.events.map((event) =>
              event.eventId === eventId
                ? {
                    ...event,
                    participationStatus: "CANCELLED",
                    isOpen: false,
                    qrToken: null,
                    canCancel: false,
                  }
                : event,
            ),
          }
        : current,
    );

  return (
    <main className="space-y-9 pt-28 pb-12">
      <div className="page-shell">
        <Link className="underline font-semibold" href="/perfil/certificados">
          Meus certificados e solicitações de vínculo
        </Link>
      </div>
      <PageHero
        eyebrow="Meu perfil"
        title={displayName}
        description={data.account.email || "Conta autenticada no DADG"}
        actions={
          <>
            <span
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${data.profile.complete && !data.profile.privacyNoticeRequired ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}
            >
              {data.profile.complete && !data.profile.privacyNoticeRequired ? (
                <CheckCircle2 size={16} />
              ) : (
                <XCircle size={16} />
              )}
              Cadastro{" "}
              {data.profile.complete && !data.profile.privacyNoticeRequired
                ? "completo"
                : "incompleto"}
            </span>
            <a
              href="/api/auth/logout"
              className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-2 text-sm font-semibold text-white dark:bg-slate-800"
            >
              <LogOut size={16} />
              Sair
            </a>
          </>
        }
        aside={
          <div className="glass-panel-strong surface-outline rounded-[28px] border border-white/80 p-5 dark:border-white/10">
            <div className="flex items-center gap-4">
              {data.account.picture ? (
                <Image
                  src={data.account.picture}
                  alt=""
                  width={64}
                  height={64}
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <div className="grid h-16 w-16 place-items-center rounded-full bg-blue-100 text-blue-700">
                  <User size={28} />
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-slate-950 dark:text-white">
                  {displayName}
                </p>
                <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                  <Mail size={13} />
                  {data.account.email}
                </p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2 text-center">
              <Stat value={data.events.length} label="inscrições" />
              <Stat
                value={
                  data.events.filter((event) => event.certificateId).length
                }
                label="emitidos nestes eventos"
              />
              <Stat value={active.length} label="ativos" />
            </div>
          </div>
        }
      />

      <section className="page-shell">
        {!data.profile.complete || data.profile.privacyNoticeRequired ? (
          <div
            role="status"
            className="mb-5 rounded-[22px] border border-amber-200 bg-amber-50 p-4 text-sm font-medium text-amber-800"
          >
            Complete os dados pessoais e o aceite de privacidade para realizar
            novas inscrições. Seus eventos e artigos continuam disponíveis.
          </div>
        ) : null}
        <div
          role="tablist"
          aria-label="Seções do perfil"
          className="flex gap-2 overflow-x-auto border-b border-slate-200 pb-px dark:border-slate-800"
        >
          <TabButton
            tab="dados"
            active={activeTab}
            buttonRef={(node) => {
              tabRefs.current.dados = node;
            }}
            onClick={() => setActiveTab("dados")}
            onKeyDown={keyboard}
          >
            Dados pessoais
          </TabButton>
          <TabButton
            tab="eventos"
            active={activeTab}
            buttonRef={(node) => {
              tabRefs.current.eventos = node;
            }}
            onClick={() => setActiveTab("eventos")}
            onKeyDown={keyboard}
          >
            Meus eventos
          </TabButton>
          {blogEnabled ? (
            <TabButton
              tab="artigos"
              active={activeTab}
              buttonRef={(node) => {
                tabRefs.current.artigos = node;
              }}
              onClick={() => setActiveTab("artigos")}
              onKeyDown={keyboard}
            >
              Artigos salvos{" "}
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
                {savedArticles.length}
              </span>
            </TabButton>
          ) : null}
        </div>
        <div
          className="mt-7"
          role="tabpanel"
          id={`panel-${activeTab}`}
          aria-labelledby={`tab-${activeTab}`}
        >
          {activeTab === "dados" ? (
            <PersonalDataPanel
              profile={data.profile}
              account={data.account}
              notice={data.privacyNotice}
              onSaved={saved}
              returnTo={returnTo}
            />
          ) : null}
          {activeTab === "eventos" ? (
            <EventsPanel
              events={data.events}
              active={active}
              onCancel={cancelSuccess}
            />
          ) : null}
          {activeTab === "artigos" ? (
            <ArticlesPanel articles={savedArticles} />
          ) : null}
        </div>
      </section>
    </main>
  );
}

function TabButton({
  tab,
  active,
  buttonRef,
  onClick,
  onKeyDown,
  children,
}: {
  tab: Tab;
  active: Tab;
  buttonRef: (node: HTMLButtonElement | null) => void;
  onClick: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>, tab: Tab) => void;
  children: React.ReactNode;
}) {
  const selected = tab === active;
  return (
    <button
      ref={buttonRef}
      id={`tab-${tab}`}
      role="tab"
      aria-selected={selected}
      aria-controls={`panel-${tab}`}
      tabIndex={selected ? 0 : -1}
      onClick={onClick}
      onKeyDown={(event) => onKeyDown(event, tab)}
      className={`relative flex shrink-0 items-center gap-2 px-4 py-4 text-sm font-semibold outline-none transition focus-visible:ring-2 focus-visible:ring-blue-500 ${selected ? "text-blue-700 dark:text-blue-300" : "text-slate-500"}`}
    >
      {children}
      {selected ? (
        <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-t bg-blue-600" />
      ) : null}
    </button>
  );
}
function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-xl bg-slate-100 p-2 dark:bg-slate-800">
      <strong className="block text-lg text-slate-950 dark:text-white">
        {value}
      </strong>
      <span className="text-[10px] text-slate-500">{label}</span>
    </div>
  );
}
function EventsPanel({
  events,
  active,
  onCancel,
}: {
  events: EventHistory[];
  active: EventHistory[];
  onCancel: (id: string) => void;
}) {
  return (
    <div className="space-y-9">
      {active.length ? (
        <section>
          <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white">
            <Calendar className="text-blue-600" />
            Inscrições ativas
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {active.map((event) => (
              <EventHistoryCard
                key={event.participationId}
                event={event}
                onCancelSuccess={onCancel}
              />
            ))}
          </div>
        </section>
      ) : null}
      <section>
        <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white">
          <Clock className="text-slate-500" />
          Histórico de participações
        </h2>
        {events.length ? (
          <div className="space-y-3">
            {events.map((event) => (
              <EventHistoryCard
                key={event.participationId}
                event={event}
                detailed
              />
            ))}
          </div>
        ) : (
          <InfoCard
            title="Nenhuma participação"
            description="Você ainda não participou de nenhum evento."
          >
            <Link
              href="/eventos"
              className="text-sm font-semibold text-blue-600"
            >
              Explorar eventos →
            </Link>
          </InfoCard>
        )}
      </section>
    </div>
  );
}
function ArticlesPanel({ articles }: { articles: BlogPostData[] }) {
  return (
    <section>
      <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white">
        <BookOpen className="text-blue-600" />
        Artigos favoritos
      </h2>
      {articles.length ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((post) => (
            <BlogCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <InfoCard
          title="Nenhum artigo salvo"
          description="Você ainda não salvou nenhum artigo."
        >
          <Link href="/blog" className="text-sm font-semibold text-blue-600">
            Explorar o Blog →
          </Link>
        </InfoCard>
      )}
    </section>
  );
}

function EventHistoryCard({
  event,
  detailed = false,
  onCancelSuccess,
}: {
  event: EventHistory;
  detailed?: boolean;
  onCancelSuccess?: (id: string) => void;
}) {
  const [canceling, setCanceling] = useState(false);
  const [error, setError] = useState("");
  const [showQr, setShowQr] = useState(false);
  const cancel = async () => {
    if (!confirm("Tem certeza que deseja cancelar sua inscrição neste evento?"))
      return;
    setCanceling(true);
    setError("");
    try {
      const response = await fetch(
        `/api/v1/events/${event.eventId}/registration`,
        { method: "DELETE" },
      );
      const data = await response.json();
      if (response.ok) onCancelSuccess?.(event.eventId);
      else setError(data.error || "Erro ao cancelar inscrição.");
    } catch {
      setError("Erro de conexão.");
    } finally {
      setCanceling(false);
    }
  };
  return (
    <article className="rounded-2xl border border-white/90 bg-white/90 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-white/10 dark:bg-slate-900/80">
      <div className="flex items-start gap-4">
        <div
          className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${event.certificateId ? "bg-emerald-100 text-emerald-600" : event.isOpen ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500"}`}
        >
          {event.certificateId ? (
            <Award size={20} />
          ) : event.isOpen ? (
            <CheckCircle2 size={20} />
          ) : (
            <Clock size={20} />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="truncate font-semibold text-slate-900 dark:text-white">
              {event.eventName}
            </h3>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {event.participationStatus === "CANCELLED"
                ? "Cancelada"
                : event.participationStatus === "PENDING"
                  ? "Aguardando pagamento"
                  : event.participationStatus === "REVIEW"
                    ? "Em revisão"
                    : event.isOpen
                      ? "Inscrição confirmada"
                      : "Encerrado"}
            </span>
          </div>
          {detailed && event.eventDescription ? (
            <p className="mt-1 line-clamp-2 text-xs text-slate-500">
              {event.eventDescription}
            </p>
          ) : null}
          <p className="mt-1.5 flex items-center gap-1 text-xs text-slate-500">
            <Clock size={12} />
            Inscrito em {new Date(event.enrolledAt).toLocaleDateString("pt-BR")}
          </p>
          {event.checkedIn ? (
            <p className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-emerald-600">
              <MapPin size={12} />
              Presença confirmada
            </p>
          ) : null}
        </div>
      </div>
      {event.qrToken && event.isOpen ? (
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setShowQr((value) => !value)}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 py-2.5 text-sm font-semibold text-blue-600 dark:border-blue-800"
          >
            <QrCode size={16} />
            {showQr ? "Ocultar QR Code do ingresso" : "Ver QR Code do ingresso"}
          </button>
          {showQr ? (
            <div className="mt-3 flex flex-col items-center gap-2 rounded-xl bg-slate-900 p-4">
              <p className="text-xs text-slate-300">
                Apresente este código na entrada do evento
              </p>
              <LocalQrCode value={event.qrToken} />
            </div>
          ) : null}
        </div>
      ) : null}
      {event.paymentUrl ? (
        <a
          href={event.paymentUrl}
          className="mt-4 block rounded-xl bg-blue-700 p-3 text-center text-white"
        >
          Continuar pagamento
        </a>
      ) : null}
      {event.participationStatus === "CANCELLED" ? (
        <p>Inscrição cancelada</p>
      ) : event.participationStatus === "REVIEW" ? (
        <p>Pagamento em revisão pela organização</p>
      ) : null}
      {event.certificateId ? (
        <Link
          href={`/certificados/meuCertificado/${event.certificateId}`}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white"
        >
          Ver certificado
          <ExternalLink size={13} />
        </Link>
      ) : event.certificateReleased ? (
        <div className="mt-4 rounded-xl bg-amber-50 py-2.5 text-center text-xs font-medium text-amber-700">
          Certificados liberados — verifique em breve
        </div>
      ) : !event.isOpen ? (
        <div className="mt-4 rounded-xl bg-slate-100 py-2.5 text-center text-xs text-slate-500 dark:bg-slate-800">
          Certificado ainda não emitido
        </div>
      ) : (
        <div className="mt-4">
          {error ? (
            <p role="alert" className="mb-2 text-center text-xs text-rose-600">
              {error}
            </p>
          ) : null}
          <div className="flex gap-2">
            <Link
              href="/eventos"
              className="flex-1 rounded-xl border border-blue-200 py-2.5 text-center text-sm font-medium text-blue-600"
            >
              Ver eventos
            </Link>
            <button
              type="button"
              onClick={() => void cancel()}
              disabled={canceling || event.canCancel !== true}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 py-2.5 text-sm font-medium text-red-600 disabled:opacity-50"
            >
              {canceling ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <XCircle size={16} />
              )}
              Cancelar
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
