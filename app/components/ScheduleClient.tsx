'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  format,
  startOfMonth,
  startOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  startOfDay,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import './ScheduleClient.css';

interface Event {
  id: string;
  summary: string;
  start: { dateTime?: string; date?: string };
  end?: { dateTime?: string; date?: string };
}

const DATE_FMT = 'dd-MM-yyyy';
const DATETIME_FMT = 'dd-MM-yyyy HH:mm';

function parseDateOnlyAsLocal(dateStr: string) {
  // "YYYY-MM-DD" -> meia-noite LOCAL (não UTC)
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function getEventStartDate(event: Event): Date | null {
  if (event.start?.dateTime) return new Date(event.start.dateTime);
  if (event.start?.date) return parseDateOnlyAsLocal(event.start.date);
  return null;
}

function getEventEndDateExclusive(event: Event): Date | null {
  // Para evento dia inteiro, o Google retorna end.date como EXCLUSIVO (dia seguinte).
  if (event.end?.dateTime) return new Date(event.end.dateTime);
  if (event.end?.date) return parseDateOnlyAsLocal(event.end.date);
  return null;
}

function eventOccursOnDay(event: Event, day: Date) {
  const dayStart = startOfDay(day);

  const start = getEventStartDate(event);
  if (!start) return false;

  // Evento com horário: marca pelo dia do início
  if (event.start.dateTime) {
    return isSameDay(start, dayStart);
  }

  // Evento dia inteiro: trata como intervalo [start, end)
  const endExclusive = getEventEndDateExclusive(event);
  if (!endExclusive) return isSameDay(start, dayStart);

  const startDay = startOfDay(start);
  const endDay = startOfDay(endExclusive); // exclusivo
  return dayStart >= startDay && dayStart < endDay;
}

export default function ScheduleClient() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchEvents = async (month: Date) => {
    setLoading(true);
    try {
      // Envia date-only e deixa o route normalizar timezone
      const start = format(startOfMonth(month), 'yyyy-MM-dd');
      const end = format(startOfMonth(addMonths(month, 1)), 'yyyy-MM-dd'); // exclusivo (1º do mês seguinte)

      const res = await fetch(
        `/api/get/eventsByDate?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`
      );
      if (!res.ok) throw new Error('Erro ao buscar eventos');

      const data = await res.json();
      setEvents(data.items || []);
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(currentMonth);
  }, [currentMonth]);

  // Pré-calcula os dias que têm evento (melhora performance)
  const eventDaySet = useMemo(() => {
    const set = new Set<string>();
    const keyOf = (d: Date) => format(startOfDay(d), 'yyyy-MM-dd');

    for (const ev of events) {
      const start = getEventStartDate(ev);
      if (!start) continue;

      if (ev.start.dateTime) {
        set.add(keyOf(start));
        continue;
      }

      const endExclusive = getEventEndDateExclusive(ev);
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

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });

    const rows = [];
    let day = startDate;

    for (let week = 0; week < 6; week++) {
      const days = [];
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const key = format(startOfDay(day), 'yyyy-MM-dd');
        const hasEvent = eventDaySet.has(key);

        const isToday = isSameDay(day, new Date());
        days.push(
          <div
            key={key}
            className={`calendar-day ${
              !isSameMonth(day, monthStart) ? 'other-month' : ''
            } ${isSameDay(day, selectedDate) ? 'selected' : ''} ${isToday ? 'today' : ''}`}
            onClick={() => setSelectedDate(cloneDay)}
          >
            {format(day, 'd')}
            {hasEvent && <span className="event-indicator"></span>}
          </div>
        );

        day = addDays(day, 1);
      }

      rows.push(
        <div key={`week-${week}`} className="calendar-grid">
          {days}
        </div>
      );
    }

    return <div>{rows}</div>;
  };

  const eventsForSelectedDate = useMemo(() => {
    return events.filter((ev) => eventOccursOnDay(ev, selectedDate));
  }, [events, selectedDate]);

  return (
    <div className="calendar-wrapper">
      <div className="calendar-header">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="calendar-nav-button"
        >
          Anterior
        </button>

        <h2 className="calendar-title">
          {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
        </h2>

        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="calendar-nav-button"
        >
          Próximo
        </button>
      </div>

      <div className="calendar-weekdays">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((d) => (
          <div key={d} className="weekday">
            {d}
          </div>
        ))}
      </div>

      {renderCells()}

      <div className="events-list">
        <h3 className="events-title">
          Eventos em {format(selectedDate, DATE_FMT)}
        </h3>

        {loading ? (
          <p className="loading-message">Carregando eventos...</p>
        ) : eventsForSelectedDate.length > 0 ? (
          eventsForSelectedDate.map((event) => {
            const isAllDay = !!event.start.date && !event.start.dateTime;

            const startLabel = event.start.dateTime
              ? format(new Date(event.start.dateTime), DATETIME_FMT)
              : format(parseDateOnlyAsLocal(event.start.date!), DATE_FMT);

            const endLabel = event.end
              ? event.end.dateTime
                ? format(new Date(event.end.dateTime), DATETIME_FMT)
                : event.end.date
                  ? format(parseDateOnlyAsLocal(event.end.date), DATE_FMT)
                  : null
              : null;

            return (
              <div key={event.id} className="event-card">
                <h4 className="event-name">{event.summary}</h4>

                <p className="event-time">
                  <span className="font-bold">Início:</span> {startLabel}
                  
                </p>

                {endLabel && (
                  <p className="event-time">
                    <span className="font-bold">Fim:</span> {endLabel}
                  </p>
                )}
              </div>
            );
          })
        ) : (
          <p className="no-events-message">Nenhum evento para este dia.</p>
        )}
      </div>
    </div>
  );
}