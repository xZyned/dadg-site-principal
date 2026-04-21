"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { addDays, endOfDay, format, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowRight, CalendarRange, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalendarEvent {
  id: string;
  summary: string;
  start: { dateTime?: string; date?: string };
  end?: { dateTime?: string; date?: string };
  location?: string;
}

function getEventDate(dateTime?: string, date?: string): Date | null {
  if (dateTime) return new Date(dateTime);

  if (date) {
    const [year, month, day] = date.split("-").map(Number);
    if (!year || !month || !day) return null;
    return new Date(year, month - 1, day);
  }

  return null;
}

export default function UpcomingSchedulePopup() {
  const [dismissed, setDismissed] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAttentionRing, setShowAttentionRing] = useState(true);

  const range = useMemo(() => {
    const now = new Date();
    return {
      start: startOfDay(now),
      end: endOfDay(addDays(now, 13)),
    };
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 768px)");

    const apply = () => {
      setIsMobile(query.matches);
    };

    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setShowAttentionRing(false);
    }, 1600);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (dismissed) return;

    const fetchUpcoming = async () => {
      setLoading(true);

      try {
        const res = await fetch(
          `/api/get/eventsByDate?start=${encodeURIComponent(range.start.toISOString())}&end=${encodeURIComponent(range.end.toISOString())}`
        );

        if (!res.ok) throw new Error("Erro ao buscar eventos");

        const data = await res.json();
        setEvents((data.items || []) as CalendarEvent[]);
      } catch {
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcoming();
  }, [dismissed, range.end, range.start]);

  const items = useMemo(() => {
    return events
      .map((event) => ({ event, date: getEventDate(event.start.dateTime, event.start.date) }))
      .filter((value): value is { event: CalendarEvent; date: Date } => Boolean(value.date))
      .filter(({ date }) => date >= range.start && date <= range.end)
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [events, range.end, range.start]);

  if (dismissed) return null;

  return (
    <aside
      className={cn(
        "relative fixed bottom-3 right-3 z-[60] max-h-[calc(100vh-6.5rem)] w-[min(86vw,320px)] overflow-hidden rounded-[24px] border border-white/70 bg-white/82 p-3 shadow-[0_20px_60px_rgba(7,48,89,0.18)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/88",
        expanded ? "space-y-3" : "space-y-0"
      )}
    >
      {showAttentionRing ? (
        <div aria-hidden="true" className="popup-attention-ring">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="popup-attention-ring-svg">
            <rect
              x="1.5"
              y="1.5"
              width="97"
              height="97"
              rx="7.5"
              pathLength="100"
              className="popup-attention-ring-stroke"
            />
          </svg>
        </div>
      ) : null}

      <div className="flex items-start justify-between gap-3">
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="flex flex-1 items-start gap-3 text-left"
          aria-label={expanded ? "Recolher programacao" : "Expandir programacao"}
        >
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--brand-50)] text-[var(--brand-800)]">
            <CalendarRange className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
              Programacao
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-950 dark:text-white">Proximas duas semanas</p>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
              {format(range.start, "dd 'de' MMM", { locale: ptBR })} ate{" "}
              {format(range.end, "dd 'de' MMM", { locale: ptBR })}
            </p>
          </div>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(9,66,125,0.12)] bg-white text-slate-950 dark:border-white/15 dark:bg-white dark:text-black"
            aria-label={expanded ? "Recolher" : "Expandir"}
          >
            <ChevronDown className={cn("h-4 w-4 transition-transform", expanded ? "rotate-180" : "rotate-0")} />
          </button>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(9,66,125,0.12)] bg-white text-slate-950 dark:border-white/15 dark:bg-white dark:text-black"
            aria-label="Fechar aviso"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {expanded ? (
        <div className="max-h-[min(18rem,calc(100vh-10rem))] space-y-3 overflow-y-auto border-t border-[rgba(9,66,125,0.08)] pt-3 pr-1">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs leading-5 text-slate-600 dark:text-slate-300">
              Resumo rapido antes de abrir o calendario.
            </p>
            <Link
              href="/eventos"
              className="inline-flex flex-none items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white"
            >
              Abrir
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="rounded-[20px] border border-dashed border-[rgba(9,66,125,0.18)] bg-white/72 px-4 py-5 text-center text-sm font-medium text-slate-500 dark:bg-slate-900/68 dark:text-slate-400">
              Carregando eventos...
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-[20px] border border-dashed border-[rgba(9,66,125,0.18)] bg-white/72 px-4 py-5 text-center text-sm font-medium text-slate-500 dark:bg-slate-900/68 dark:text-slate-400">
              Sem eventos nas proximas 2 semanas.
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map(({ event, date }) => {
                const timeLabel = event.start.dateTime ? format(date, "HH:mm", { locale: ptBR }) : "Dia inteiro";

                return (
                  <li
                    key={event.id}
                    className="rounded-[20px] border border-white/70 bg-white/78 px-4 py-3 shadow-[0_16px_36px_rgba(7,48,89,0.08)] dark:border-white/10 dark:bg-slate-900/72"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                      {format(date, "EEE dd/MM", { locale: ptBR })}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-slate-950 dark:text-white">{event.summary}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">
                      {timeLabel}
                      {event.location ? ` - ${event.location}` : ""}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}

          {isMobile ? (
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              Toque na seta para abrir ou recolher.
            </p>
          ) : null}
        </div>
      ) : null}
    </aside>
  );
}
