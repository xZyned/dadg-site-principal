"use client";

import { useState } from "react";
import { CalendarDays, Users, CircleDollarSign, CheckCircle2, Loader2, Info, Gift } from "lucide-react";
import { useRouter } from "next/navigation";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

interface EventData {
  _id: string;
  eventName: string;
  eventDescription: string;
  eventBenefits?: string;
  eventType: string;
  registrationCount: number;
  maxParticipants: number;
  isOpen: boolean;
  isPaid: boolean;
  price?: number;
}

interface EventCardProps {
  event: EventData;
  isSubscribed: boolean;
  isLoggedIn: boolean;
  accessToken: string | null;
}

export default function EventCard({
  event,
  isSubscribed: initialSubscribed,
  isLoggedIn,
  accessToken,
}: EventCardProps) {
  const router = useRouter();
  const [isSubscribed, setIsSubscribed] = useState(initialSubscribed);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const formatCurrency = (value?: number) => {
    if (typeof value !== "number") return "Valor não informado";
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
  };

  const handleEnrollment = async () => {
    if (!isLoggedIn || !accessToken) {
      window.location.href = "/api/auth/login?returnTo=/eventos";
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    try {
      // Proxy server-side em /api/v1/events/[id]/registration/route.ts
      // Intercepta a chamada, injeta o Bearer token e repassa ao backend (porta 3000).
      const endpoint = `/api/v1/events/${event._id}/registration`;
      const method = isSubscribed ? "DELETE" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
      });
      const data = await res.json();

      if (res.ok) {
        setIsSubscribed(!isSubscribed);
        router.refresh();
      } else {
        setErrorMsg(data.error || data.message || "Ocorreu um erro ao processar sua inscrição.");
      }
    } catch {
      setErrorMsg("Erro de conexão. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  const isFull = event.registrationCount >= event.maxParticipants;
  const canEnroll = event.isOpen && !isFull;

  return (
    <div className="glass-panel-strong surface-outline relative overflow-hidden rounded-2xl border border-white/90 dark:border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(243,247,252,0.94)_100%)] dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.92)_0%,rgba(2,6,23,0.86)_100%)] p-6 shadow-[0_24px_64px_rgba(4,26,49,0.14)] flex flex-col h-full transition-transform hover:-translate-y-1 hover:shadow-xl duration-300">
      <div className="flex-1">
        <div className="flex items-start justify-between mb-4">
          <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/30 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:text-blue-300 ring-1 ring-inset ring-blue-700/10 dark:ring-blue-400/20">
            {event.eventType}
          </span>
          {isSubscribed && (
            <span className="flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 size={14} className="mr-1" />
              Inscrito
            </span>
          )}
        </div>

        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 leading-tight">
          {event.eventName}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-6">
          {event.eventDescription}
        </p>

        <div className="space-y-3 mb-6">
          <div className="flex items-center text-sm text-slate-700 dark:text-slate-300">
            <CalendarDays size={16} className="mr-2 text-slate-400" />
            {event.isOpen ? "Inscrições abertas" : "Inscrições fechadas"}
          </div>
          <div className="flex items-center text-sm text-slate-700 dark:text-slate-300">
            <Users size={16} className="mr-2 text-slate-400" />
            {event.registrationCount} / {event.maxParticipants} vagas ocupadas
          </div>
          <div className="flex items-center text-sm text-slate-700 dark:text-slate-300">
            <CircleDollarSign size={16} className="mr-2 text-slate-400" />
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              {event.isPaid ? formatCurrency(event.price) : "Gratuito"}
            </span>
          </div>
        </div>

        {event.eventBenefits && (
          <div className="mb-6 p-4 rounded-xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30">
            <h4 className="flex items-center text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
              <Gift size={16} className="mr-2 text-blue-600 dark:text-blue-400" />
              Benefícios
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {event.eventBenefits}
            </p>
          </div>
        )}
      </div>

      {errorMsg && (
        <div className="mb-4 flex items-start text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded-md">
          <Info size={14} className="mr-1.5 flex-shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      <button
        onClick={handleEnrollment}
        disabled={isLoading || (!canEnroll && !isSubscribed)}
        className={`mt-auto flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
          isSubscribed
            ? "bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 border border-red-200 dark:border-red-900/50"
            : !canEnroll
            ? "bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-500"
            : !isLoggedIn
            ? "bg-blue-600 text-white hover:bg-blue-500 shadow-md"
            : "bg-slate-900 text-white shadow-md hover:bg-blue-600 hover:shadow-lg dark:bg-blue-600 dark:hover:bg-blue-500"
        }`}
      >
        {isLoading ? (
          <Loader2 className="animate-spin h-5 w-5" />
        ) : isSubscribed ? (
          "Cancelar Inscrição"
        ) : !canEnroll ? (
          "Vagas Esgotadas"
        ) : !isLoggedIn ? (
          "Entrar para se inscrever"
        ) : (
          "Inscrever-se"
        )}
      </button>
    </div>
  );
}
