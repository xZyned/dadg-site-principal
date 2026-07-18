"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  User,
  Mail,
  Calendar,
  Award,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  ExternalLink,
  LogOut,
  BookOpen,
  QrCode,
  MapPin,
} from "lucide-react";
import BlogCard, { BlogPostData } from "@/app/components/BlogCard";



interface EventHistory {
  participationId: string;
  eventId: string;
  eventName: string;
  eventDescription: string;
  eventType: string;
  status: string;
  isOpen: boolean;
  enrolledAt: string;
  certificateId: string | null;
  /** Token do QR Code para o ingresso físico */
  qrToken: string | null;
  /** Se a presença do aluno já foi confirmada pelo admin */
  checkedIn: boolean;
  checkedInAt: string | null;
  /** Se o admin já liberou os certificados automáticos para este evento */
  certificateReleased: boolean;
}

interface UserProfile {
  name: string;
  email: string;
  picture: string;
  sub: string;
}

interface ProfileData {
  user: UserProfile;
  events: EventHistory[];
}

export default function PerfilPage() {
  const [data, setData] = useState<ProfileData | null>(null);
  const [savedArticles, setSavedArticles] = useState<BlogPostData[]>([]);
  const [activeTab, setActiveTab] = useState<"eventos" | "artigos">("eventos");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [blogEnabled, setBlogEnabled] = useState(true);

  useEffect(() => {
    // Chamamos o endpoint do backend diretamente através do proxy configurado no next.config.js
    // O Next.js envia o cookie de sessão Auth0 automaticamente!
    Promise.all([
      fetch("/api/perfil/proxy").then((res) => {
        if (res.status === 401) throw new Error("not_authenticated");
        if (!res.ok) throw new Error("error");
        return res.json();
      }),
      fetch("/api/v1/blog/proxy/bookmarks").then((res) => {
        if (!res.ok) return { data: [] };
        return res.json();
      }),
      fetch("/api/settings").then(res => res.ok ? res.json() : { blogEnabled: true })
    ])
      .then(([profileJson, bookmarksJson, settingsJson]) => {
        setData(profileJson);
        setSavedArticles(bookmarksJson.data || []);
        if (settingsJson && typeof settingsJson.blogEnabled === "boolean") {
          setBlogEnabled(settingsJson.blogEnabled);
        }
      })
      .catch((err) => {
        if (err.message === "not_authenticated") {
          window.location.href = "/api/auth/login?returnTo=/perfil";
        } else {
          setError("Erro ao carregar perfil. Tente novamente mais tarde.");
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto" />
          <p className="text-slate-600 dark:text-slate-400 font-medium">Carregando seu perfil...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4 max-w-sm">
          <XCircle className="h-12 w-12 text-red-500 mx-auto" />
          <p className="text-slate-700 dark:text-slate-300">{error}</p>
          <button onClick={() => window.location.reload()} className="rounded-xl bg-slate-900 text-white px-6 py-3 text-sm font-semibold hover:bg-blue-600 transition-all">
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;
  const { user, events } = data;
  const activeSubscriptions = events.filter((e) => e.isOpen);

  const handleCancelSuccess = (eventId: string) => {
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        events: prev.events.filter((e) => e.eventId !== eventId),
      };
    });
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Hero do Perfil */}
        <div className="relative overflow-hidden rounded-3xl border border-white/90 dark:border-white/10 bg-gradient-to-br from-[#002B5B] via-[#09427D] to-[#1a5fa8] p-8 shadow-[0_24px_64px_rgba(4,26,49,0.25)]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(79,143,214,0.3),transparent_60%)]" />
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative flex-shrink-0">
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white/30 shadow-2xl ring-4 ring-blue-400/20">
                {user.picture ? (
                  <Image src={user.picture} alt={user.name} width={112} height={112} className="object-cover w-full h-full" />
                ) : (
                  <div className="w-full h-full bg-blue-600/40 flex items-center justify-center">
                    <User className="w-12 h-12 text-white" />
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1 text-center sm:text-left text-white">
              <h1 className="text-3xl font-bold leading-tight mb-1">{user.name}</h1>
              <div className="flex items-center justify-center sm:justify-start gap-2 text-blue-100 text-sm mb-4">
                <Mail className="w-4 h-4" />
                <span>{user.email}</span>
              </div>
              <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-2 text-center min-w-[80px]">
                  <p className="text-2xl font-bold">{events.length}</p>
                  <p className="text-xs text-blue-200">inscrições</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-2 text-center min-w-[80px]">
                  <p className="text-2xl font-bold">{events.filter((e) => e.certificateId).length}</p>
                  <p className="text-xs text-blue-200">certificados</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-2 text-center min-w-[80px]">
                  <p className="text-2xl font-bold">{activeSubscriptions.length}</p>
                  <p className="text-xs text-blue-200">ativos</p>
                </div>
                {blogEnabled && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-2 text-center min-w-[80px]">
                    <p className="text-2xl font-bold">{savedArticles.length}</p>
                    <p className="text-xs text-blue-200">salvos</p>
                  </div>
                )}
              </div>
            </div>
            <a href="/api/auth/logout" className="flex items-center gap-2 bg-white/10 hover:bg-red-500/80 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all border border-white/20">
              <LogOut className="w-4 h-4" />
              Sair
            </a>
          </div>
        </div>

        {/* Tabs de Navegação */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6">
          <button
            onClick={() => setActiveTab("eventos")}
            className={`pb-4 text-sm font-semibold transition-colors relative ${
              activeTab === "eventos"
                ? "text-blue-600 dark:text-blue-400"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
            }`}
          >
            Meus Eventos
            {activeTab === "eventos" && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400 rounded-t-full" />
            )}
          </button>
          
          {blogEnabled && (
            <button
              onClick={() => setActiveTab("artigos")}
              className={`pb-4 text-sm font-semibold transition-colors relative flex items-center gap-2 ${
                activeTab === "artigos"
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
              }`}
            >
              Artigos Salvos
              <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400 text-xs px-2 py-0.5 rounded-full">
                {savedArticles.length}
              </span>
              {activeTab === "artigos" && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400 rounded-t-full" />
              )}
            </button>
          )}
        </div>

        {activeTab === "eventos" ? (
          <>
            {/* Inscrições Ativas */}
            {activeSubscriptions.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-blue-600" />
              Inscrições Ativas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeSubscriptions.map((event) => (
                <EventHistoryCard key={event.participationId} event={event} onCancelSuccess={handleCancelSuccess} />
              ))}
            </div>
          </section>
        )}

        {/* Histórico Completo */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Clock className="w-6 h-6 text-slate-500" />
            Histórico de Participações
          </h2>
          {events.length === 0 ? (
            <div className="glass-panel-strong p-10 text-center rounded-2xl border border-white/90 dark:border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(243,247,252,0.94)_100%)] dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.92)_0%,rgba(2,6,23,0.86)_100%)]">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 dark:text-slate-400 font-medium">Você ainda não participou de nenhum evento.</p>
              <Link href="/eventos" className="mt-4 inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-500 font-semibold">
                Explorar eventos disponíveis →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {events.map((event) => (
                <EventHistoryCard key={event.participationId} event={event} detailed />
              ))}
            </div>
          )}
        </section>
      </>
        ) : (
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-600" />
              Artigos Favoritos
            </h2>
            {savedArticles.length === 0 ? (
              <div className="glass-panel-strong p-10 text-center rounded-2xl border border-white/90 dark:border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(243,247,252,0.94)_100%)] dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.92)_0%,rgba(2,6,23,0.86)_100%)]">
                <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 dark:text-slate-400 font-medium">Você ainda não salvou nenhum artigo.</p>
                <Link href="/blog" className="mt-4 inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-500 font-semibold">
                  Explorar o Blog →
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedArticles.map((post) => (
                  <BlogCard key={post._id} post={post} />
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

function EventHistoryCard({ event, detailed = false, onCancelSuccess }: { event: EventHistory; detailed?: boolean; onCancelSuccess?: (eventId: string) => void }) {
  const [isCanceling, setIsCanceling] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showQr, setShowQr] = useState(false);

  const enrollDate = new Date(event.enrolledAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const handleCancel = async () => {
    if (!confirm("Tem certeza que deseja cancelar sua inscrição neste evento?")) return;
    setIsCanceling(true);
    setErrorMsg("");
    try {
      const res = await fetch(`/api/v1/events/${event.eventId}/registration`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        onCancelSuccess?.(event.eventId);
      } else {
        setErrorMsg(data.error || data.message || "Erro ao cancelar inscrição.");
      }
    } catch {
      setErrorMsg("Erro de conexão.");
    } finally {
      setIsCanceling(false);
    }
  };

  const qrImageUrl = event.qrToken
    ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(event.qrToken)}&bgcolor=0f172a&color=ffffff&margin=8`
    : null;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/90 dark:border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(243,247,252,0.94)_100%)] dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.92)_0%,rgba(2,6,23,0.86)_100%)] p-5 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
      <div className="flex items-start gap-4">
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
          event.certificateId ? "bg-emerald-100 dark:bg-emerald-900/30" : event.isOpen ? "bg-blue-100 dark:bg-blue-900/30" : "bg-slate-100 dark:bg-slate-800"
        }`}>
          {event.certificateId ? (
            <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          ) : event.isOpen ? (
            <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          ) : (
            <Clock className="w-5 h-5 text-slate-500 dark:text-slate-400" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h3 className="font-semibold text-slate-900 dark:text-white leading-tight truncate">{event.eventName}</h3>
            <span className={`flex-shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${
              event.isOpen ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
            }`}>
              {event.isOpen ? "Em andamento" : "Encerrado"}
            </span>
          </div>
          {detailed && event.eventDescription && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{event.eventDescription}</p>
          )}
          <div className="flex items-center gap-1 mt-1.5">
            <Clock className="w-3 h-3 text-slate-400" />
            <span className="text-xs text-slate-500 dark:text-slate-400">Inscrito em {enrollDate}</span>
          </div>
          {/* Status de presença */}
          {event.checkedIn ? (
            <span className="inline-flex items-center gap-1 mt-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <MapPin className="w-3 h-3" />Presença confirmada
            </span>
          ) : event.isOpen ? (
            <span className="inline-flex items-center gap-1 mt-1.5 text-xs font-medium text-amber-600 dark:text-amber-400">
              <QrCode className="w-3 h-3" />Apresente o QR Code na entrada
            </span>
          ) : null}
          {event.eventType && (
            <span className="inline-block mt-1.5 text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">
              {event.eventType}
            </span>
          )}
        </div>
      </div>

      {/* QR Code do Ingresso — exibido se inscrito e evento aberto sem presença ainda */}
      {qrImageUrl && event.isOpen && !event.checkedIn && (
        <div className="mt-4">
          <button
            onClick={() => setShowQr(!showQr)}
            className="flex items-center justify-center gap-2 w-full rounded-xl border border-blue-200 dark:border-blue-800/50 text-blue-600 dark:text-blue-400 text-sm font-semibold py-2.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
          >
            <QrCode className="w-4 h-4" />
            {showQr ? "Ocultar QR Code do Ingresso" : "Ver QR Code do Ingresso"}
          </button>
          {showQr && (
            <div className="mt-3 flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-900 border border-slate-700">
              <p className="text-xs text-slate-400 text-center">Apresente este código na entrada do evento</p>
              <img
                src={qrImageUrl}
                alt="QR Code do Ingresso"
                width={180}
                height={180}
                className="rounded-lg"
              />
              <p className="text-xs text-slate-500 font-mono break-all text-center">{event.qrToken?.slice(0, 18)}...</p>
            </div>
          )}
        </div>
      )}

      {/* Ações: Certificado, Aguardando, ou Cancelar/Ver eventos */}
      {event.certificateId ? (
        <Link href={`/certificados?search=${encodeURIComponent(event.eventName)}`} className="mt-4 flex items-center justify-center gap-2 w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold py-2.5 transition-all shadow-sm hover:shadow-md">
          <Award className="w-4 h-4" />Ver Certificado<ExternalLink className="w-3 h-3" />
        </Link>
      ) : event.certificateReleased && !event.certificateId ? (
        <div className="mt-4 flex items-center justify-center gap-2 w-full rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 text-amber-600 dark:text-amber-400 text-xs font-medium py-2.5">
          <Clock className="w-3.5 h-3.5" />Certificados liberados — verifique em breve
        </div>
      ) : !event.isOpen ? (
        <div className="mt-4 flex items-center justify-center gap-2 w-full rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-medium py-2.5">
          <Clock className="w-3.5 h-3.5" />Certificado ainda não emitido
        </div>
      ) : (
        <div className="mt-4">
          {errorMsg && <p className="text-xs text-red-500 mb-2 text-center">{errorMsg}</p>}
          <div className="flex gap-2">
            <Link href="/eventos" className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-blue-200 dark:border-blue-900/50 text-blue-600 dark:text-blue-400 text-sm font-medium py-2.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all">
              <Calendar className="w-4 h-4" />Ver eventos
            </Link>
            <button
              onClick={handleCancel}
              disabled={isCanceling}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-sm font-medium py-2.5 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all disabled:opacity-50"
            >
              {isCanceling ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
