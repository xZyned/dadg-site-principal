"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  addDays,
  addMonths,
  format,
  isSameDay,
  isSameMonth,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Event {
  id: string;
  summary: string;
  location?: string;
  start: { dateTime?: string; date?: string };
  end?: { dateTime?: string; date?: string };
}

const DATE_FMT = "dd-MM-yyyy";
const DATETIME_FMT = "dd-MM-yyyy HH:mm";

function parseDateOnlyAsLocal(dateStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function getEventStartDate(event: Event): Date | null {
  if (event.start?.dateTime) return new Date(event.start.dateTime);
  if (event.start?.date) return parseDateOnlyAsLocal(event.start.date);
  return null;
}

function getEventEndDateExclusive(event: Event): Date | null {
  if (event.end?.dateTime) return new Date(event.end.dateTime);
  if (event.end?.date) return parseDateOnlyAsLocal(event.end.date);
  return null;
}

function eventOccursOnDay(event: Event, day: Date) {
  const dayStart = startOfDay(day);
  const start = getEventStartDate(event);

  if (!start) return false;

  if (event.start.dateTime) {
    return isSameDay(start, dayStart);
  }

  const endExclusive = getEventEndDateExclusive(event);

  if (!endExclusive) return isSameDay(start, dayStart);

  const startDay = startOfDay(start);
  const endDay = startOfDay(endExclusive);
  return dayStart >= startDay && dayStart < endDay;
}

export default function ScheduleClient() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);

      try {
        const start = format(startOfMonth(currentMonth), "yyyy-MM-dd");
        const end = format(startOfMonth(addMonths(currentMonth, 1)), "yyyy-MM-dd");
        const res = await fetch(
          `/api/get/eventsByDate?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`
        );

        if (!res.ok) throw new Error("Erro ao buscar eventos");

        const data = await res.json();
        setEvents(data.items || []);
      } catch (error) {
        console.error("Erro ao buscar eventos:", error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [currentMonth]);

  const eventDaySet = useMemo(() => {
    const set = new Set<string>();
    const keyOf = (date: Date) => format(startOfDay(date), "yyyy-MM-dd");

    for (const event of events) {
      const start = getEventStartDate(event);
      if (!start) continue;

      if (event.start.dateTime) {
        set.add(keyOf(start));
        continue;
      }

      const endExclusive = getEventEndDateExclusive(event);
      if (!endExclusive) {
        set.add(keyOf(start));
        continue;
      }

      let cursor = startOfDay(start);
      const endDay = startOfDay(endExclusive);
      while (cursor < endDay) {
        set.add(keyOf(cursor));
        cursor = addDays(cursor, 1);
      }
    }

    return set;
  }, [events]);

  const eventsForSelectedDate = useMemo(
    () => events.filter((event) => eventOccursOnDay(event, selectedDate)),
    [events, selectedDate]
  );

  const weeks = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
    const rows: Date[][] = [];
    let day = startDate;

    for (let week = 0; week < 6; week += 1) {
      const days: Date[] = [];
      for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
        days.push(day);
        day = addDays(day, 1);
      }
      rows.push(days);
    }

    return rows;
  }, [currentMonth]);

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_380px]">
      <div className="glass-panel surface-outline rounded-[30px] border border-white/70 p-5 sm:p-6">
        <div className="flex flex-col gap-4 border-b border-[rgba(9,66,125,0.08)] pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500 dark:text-slate-400">Calendário</p>
            <h2 className="mt-2 text-3xl font-semibold capitalize text-slate-950 dark:text-white">
              {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
            </h2>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="inline-flex items-center gap-2 rounded-full border border-[rgba(9,66,125,0.14)] bg-white/86 px-4 py-2 text-sm font-semibold text-slate-700 shadow-[0_12px_28px_rgba(7,48,89,0.08)] transition-all duration-200 hover:border-[rgba(9,66,125,0.22)] hover:bg-white hover:text-slate-950 dark:border-[rgba(148,163,184,0.24)] dark:bg-[linear-gradient(180deg,rgba(30,41,59,0.96)_0%,rgba(15,23,42,0.96)_100%)] dark:text-slate-100 dark:shadow-[0_18px_40px_rgba(2,6,23,0.34)] dark:hover:border-[rgba(96,165,250,0.34)] dark:hover:bg-[linear-gradient(180deg,rgba(51,65,85,0.98)_0%,rgba(15,23,42,0.98)_100%)] dark:hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </button>
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--brand-900)]"
            >
              Próximo
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-7 gap-2">
          {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"].map((day) => (
            <div
              key={day}
              className="px-2 py-2 text-center text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="mt-2 space-y-2">
          {weeks.map((week, index) => (
            <div key={`week-${index}`} className="grid grid-cols-7 gap-2">
              {week.map((day) => {
                const key = format(startOfDay(day), "yyyy-MM-dd");
                const hasEvent = eventDaySet.has(key);
                const isToday = isSameDay(day, new Date());
                const isSelected = isSameDay(day, selectedDate);
                const outsideMonth = !isSameMonth(day, currentMonth);

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedDate(day)}
                    className={cn(
                      "relative min-h-[76px] rounded-[22px] border px-3 py-3 text-center transition-all duration-200 sm:min-h-[88px] sm:text-left",
                      outsideMonth
                        ? "border-[rgba(9,66,125,0.08)] bg-white/45 text-slate-400 dark:border-white/6 dark:bg-slate-900/28 dark:text-slate-600"
                        : "border-[rgba(9,66,125,0.14)] bg-white/78 text-slate-800 hover:-translate-y-0.5 hover:border-[rgba(9,66,125,0.2)] hover:shadow-[0_16px_36px_rgba(7,48,89,0.08)] dark:border-white/10 dark:bg-slate-900/72 dark:text-slate-200",
                      isSelected && "border-[var(--brand-800)] bg-[rgba(9,66,125,0.08)] text-slate-950 dark:text-white",
                      isToday && !isSelected && "border-[rgba(9,66,125,0.18)] bg-[rgba(9,66,125,0.04)]"
                    )}
                  >
                    <span className={cn("block text-sm font-semibold", isToday && "text-[var(--brand-800)]")}>
                      {format(day, "d")}
                    </span>
                    {hasEvent ? (
                      <>
                        <span
                          aria-hidden="true"
                          className="absolute left-1/2 top-3 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-[var(--brand-800)] shadow-[0_0_0_4px_rgba(9,66,125,0.12)] sm:hidden"
                        />
                        <span className="absolute bottom-3 left-3 hidden items-center rounded-full bg-[var(--brand-800)] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white sm:inline-flex">
                          Evento
                        </span>
                      </>
                    ) : null}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="glass-panel surface-outline rounded-[30px] border border-white/70 p-5 sm:p-6">
        <div className="border-b border-[rgba(9,66,125,0.08)] pb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500 dark:text-slate-400">Agenda do dia</p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">
            Eventos em {format(selectedDate, DATE_FMT)}
          </h3>
          <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
            Selecione um dia no calendário para visualizar a programação prevista.
          </p>
        </div>

        <div className="mt-5 space-y-4">
          {loading ? (
            <div className="rounded-[24px] border border-dashed border-[rgba(9,66,125,0.18)] bg-white/70 px-5 py-8 text-center text-sm font-medium text-slate-500 dark:bg-slate-900/68 dark:text-slate-400">
              Carregando eventos...
            </div>
          ) : eventsForSelectedDate.length > 0 ? (
            eventsForSelectedDate.map((event) => {
              const isAllDay = Boolean(event.start.date && !event.start.dateTime);
              const startLabel = event.start.dateTime
                ? format(new Date(event.start.dateTime), DATETIME_FMT)
                : format(parseDateOnlyAsLocal(event.start.date || ""), DATE_FMT);

              const endLabel = event.end
                ? event.end.dateTime
                  ? format(new Date(event.end.dateTime), DATETIME_FMT)
                  : event.end.date
                    ? format(parseDateOnlyAsLocal(event.end.date), DATE_FMT)
                    : null
                : null;

              return (
                <article
                  key={event.id}
                  className="rounded-[24px] border border-white/70 bg-white/82 p-5 shadow-[0_18px_40px_rgba(7,48,89,0.08)] dark:border-white/10 dark:bg-slate-900/72"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
                        {isAllDay ? "Dia inteiro" : "Horário definido"}
                      </p>
                      <h4 className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">{event.summary}</h4>
                    </div>
                    <span className="rounded-full bg-[var(--brand-50)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--brand-800)]">
                      Evento
                    </span>
                  </div>

                  <div className="mt-5 space-y-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                    <p>
                      <span className="font-semibold text-slate-800 dark:text-slate-100">Início:</span> {startLabel}
                    </p>
                    {endLabel ? (
                      <p>
                        <span className="font-semibold text-slate-800 dark:text-slate-100">Fim:</span> {endLabel}
                      </p>
                    ) : null}
                    {event.location ? (
                      <p>
                        <span className="font-semibold text-slate-800 dark:text-slate-100">Local:</span> {event.location}
                      </p>
                    ) : null}
                  </div>
                </article>
              );
            })
          ) : (
            <div className="rounded-[24px] border border-dashed border-[rgba(9,66,125,0.18)] bg-white/70 px-5 py-8 text-center text-sm font-medium text-slate-500 dark:border-[rgba(148,163,184,0.24)] dark:bg-[linear-gradient(180deg,rgba(30,41,59,0.96)_0%,rgba(15,23,42,0.96)_100%)] dark:text-slate-100 dark:shadow-[0_18px_40px_rgba(2,6,23,0.34)]">
              Nenhum evento para este dia.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
