'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import { CalendarDays, Loader2, LogIn, RefreshCw, UserRound } from 'lucide-react';

type ProfileEvent = {
    participationId: string;
    eventId: string;
    eventName: string;
    eventDescription?: string;
    isOpen: boolean;
    enrolledAt: string;
};

type AvailableEvent = {
    _id: string;
    eventName: string;
    eventDescription: string;
    registrationCount: number;
    maxParticipants: number;
    isOpen?: boolean;
    statusDetails?: {
        status: 'DRAFT' | 'PUBLISHED_OPEN' | 'PUBLISHED_CLOSED' | 'CERTIFICATE_ONLY';
        registrationEndDate?: string;
    };
};

export default function EventDashboard() {
    const { user, isLoading: isUserLoading } = useUser();
    const [events, setEvents] = useState<AvailableEvent[]>([]);
    const [participations, setParticipations] = useState<ProfileEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [pendingEventId, setPendingEventId] = useState<string | null>(null);
    const [error, setError] = useState('');

    const loadDashboard = useCallback(async () => {
        if (!user) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError('');

        const now = new Date();
        const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

        try {
            const [profileResponse, eventsResponse] = await Promise.all([
                fetch('/api/perfil/proxy', { cache: 'no-store' }),
                fetch(`/api/v1/events/openForRegistration/${yearMonth}`, { cache: 'no-store' }),
            ]);

            if (!profileResponse.ok) throw new Error('Não foi possível carregar suas inscrições.');
            if (!eventsResponse.ok) throw new Error('Não foi possível carregar os eventos disponíveis.');

            const profileJson = await profileResponse.json();
            const eventsJson = await eventsResponse.json();
            setParticipations(profileJson.events || []);
            setEvents(eventsJson.data || []);
        } catch (loadError) {
            setError(loadError instanceof Error ? loadError.message : 'Erro ao carregar o painel.');
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (!isUserLoading) void loadDashboard();
    }, [isUserLoading, loadDashboard]);

    const isParticipating = (eventId: string) =>
        participations.some((participation) => participation.eventId === eventId);

    const canRegister = (event: AvailableEvent) => {
        const isOpen = event.statusDetails
            ? event.statusDetails.status === 'PUBLISHED_OPEN'
            : event.isOpen === true;
        const endDate = event.statusDetails?.registrationEndDate;
        return isOpen && (!endDate || new Date(endDate).getTime() >= Date.now());
    };

    const changeRegistration = async (event: AvailableEvent, method: 'POST' | 'DELETE') => {
        setPendingEventId(event._id);
        setError('');

        try {
            const response = await fetch(`/api/v1/events/${event._id}/registration`, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: method === 'POST'
                    ? JSON.stringify({ ownerEmail: user?.email || '', ownerCpf: '' })
                    : undefined,
            });
            const responseBody = await response.json();
            if (!response.ok) {
                throw new Error(responseBody.error || responseBody.message || 'Não foi possível atualizar a inscrição.');
            }
            await loadDashboard();
        } catch (registrationError) {
            setError(registrationError instanceof Error ? registrationError.message : 'Erro ao atualizar a inscrição.');
        } finally {
            setPendingEventId(null);
        }
    };

    if (isUserLoading || isLoading) {
        return (
            <main className="flex min-h-screen items-center justify-center pt-24">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" aria-label="Carregando painel" />
            </main>
        );
    }

    if (!user) {
        return (
            <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center gap-5 px-6 text-center">
                <LogIn className="h-12 w-12 text-blue-600" />
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Entre para gerenciar seus eventos</h1>
                <a href="/api/auth/login?returnTo=/panel/eventos/inscricoes" className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white">
                    Fazer login
                </a>
            </main>
        );
    }

    return (
        <main className="page-shell min-h-screen space-y-10 pb-16 pt-28">
            <header className="glass-panel-strong rounded-3xl border border-white/80 p-6 dark:border-white/10 sm:p-8">
                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">Painel de eventos</p>
                        <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">Inscrições e agenda</h1>
                        <p className="mt-2 text-slate-600 dark:text-slate-300">Acompanhe sua participação e encontre novos eventos.</p>
                    </div>
                    <button onClick={() => void loadDashboard()} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold dark:border-slate-700">
                        <RefreshCw className="h-4 w-4" /> Atualizar
                    </button>
                </div>
            </header>

            {error && <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">{error}</p>}

            <section>
                <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white"><UserRound className="h-6 w-6 text-blue-600" />Minha agenda</h2>
                {participations.length === 0 ? (
                    <p className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500 dark:border-slate-700">Você ainda não possui inscrições.</p>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {participations.map((participation) => (
                            <article key={participation.participationId} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                <h3 className="font-semibold text-slate-900 dark:text-white">{participation.eventName}</h3>
                                {participation.eventDescription && <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{participation.eventDescription}</p>}
                                <div className="mt-4 flex items-center justify-between gap-3">
                                    <span className="text-xs text-slate-500">Inscrito em {new Date(participation.enrolledAt).toLocaleDateString('pt-BR')}</span>
                                    {participation.isOpen && (
                                        <button
                                            onClick={() => void changeRegistration({ _id: participation.eventId, eventName: participation.eventName, eventDescription: participation.eventDescription || '', registrationCount: 0, maxParticipants: 0, isOpen: true }, 'DELETE')}
                                            disabled={pendingEventId === participation.eventId}
                                            className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 disabled:opacity-50 dark:border-red-900/50 dark:text-red-400"
                                        >
                                            Cancelar
                                        </button>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>

            <section>
                <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white"><CalendarDays className="h-6 w-6 text-blue-600" />Eventos disponíveis</h2>
                {events.length === 0 ? (
                    <p className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500 dark:border-slate-700">Nenhum evento aberto neste mês.</p>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {events.map((event) => {
                            const subscribed = isParticipating(String(event._id));
                            const available = canRegister(event);
                            return (
                                <article key={String(event._id)} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                    <h3 className="font-semibold text-slate-900 dark:text-white">{event.eventName}</h3>
                                    <p className="mt-2 line-clamp-3 text-sm text-slate-600 dark:text-slate-400">{event.eventDescription}</p>
                                    <p className="mt-3 text-xs text-slate-500">{event.registrationCount} de {event.maxParticipants} vagas ocupadas</p>
                                    <button
                                        onClick={() => void changeRegistration(event, subscribed ? 'DELETE' : 'POST')}
                                        disabled={pendingEventId === String(event._id) || (!available && !subscribed)}
                                        className={`mt-4 w-full rounded-xl px-4 py-2.5 text-sm font-semibold disabled:opacity-50 ${subscribed ? 'border border-red-200 text-red-600 dark:border-red-900/50 dark:text-red-400' : 'bg-blue-600 text-white'}`}
                                    >
                                        {pendingEventId === String(event._id) ? 'Processando...' : subscribed ? 'Cancelar inscrição' : available ? 'Inscrever-se' : 'Inscrições encerradas'}
                                    </button>
                                </article>
                            );
                        })}
                    </div>
                )}
            </section>

            <div className="flex flex-wrap gap-3">
                <Link href="/perfil" className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Ver perfil completo</Link>
                <Link href="/eventos" className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold dark:border-slate-700">Calendário público</Link>
            </div>
        </main>
    );
}
