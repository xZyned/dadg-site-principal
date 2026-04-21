'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle, Clock, XCircle, AlertCircle, Loader2, Calendar, ArrowLeft, Trash2 } from 'lucide-react';
import Link from 'next/link';

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface EventoPopulado {
    _id: string;
    eventName: string;
    eventDescription: string;
    eventType?: string;
    isPaid: boolean;
    price?: number;
    maxParticipants?: number;
}

interface Inscricao {
    _id: string;
    eventId: EventoPopulado | string;
    status: 'pending' | 'confirmed' | 'cancelled' | 'waitlist';
    isPaid: boolean;
    registeredAt: string;
    paymentInfo?: { amount?: number; paidAt?: string; method?: string };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: Inscricao['status'] }) {
    const map = {
        confirmed: { label: 'Confirmado', bg: '#d1fae5', color: '#065f46', icon: <CheckCircle size={13} /> },
        pending: { label: 'Pendente', bg: '#fef3c7', color: '#92400e', icon: <Clock size={13} /> },
        waitlist: { label: 'Lista de espera', bg: '#dbeafe', color: '#1e40af', icon: <AlertCircle size={13} /> },
        cancelled: { label: 'Cancelado', bg: '#fee2e2', color: '#991b1b', icon: <XCircle size={13} /> },
    };
    const s = map[status] ?? map.pending;
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '4px',
            background: s.bg, color: s.color, borderRadius: '999px',
            padding: '3px 10px', fontSize: '12px', fontWeight: 600,
        }}>
            {s.icon} {s.label}
        </span>
    );
}

function formatDate(dateStr: string) {
    try {
        return new Date(dateStr).toLocaleDateString('pt-BR', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });
    } catch {
        return dateStr;
    }
}

// ─── Componente Principal ─────────────────────────────────────────────────────

export default function MinhasInscricoes() {
    const [inscricoes, setInscricoes] = useState<Inscricao[]>([]);
    const [loading, setLoading] = useState(true);
    const [cancelando, setCancelando] = useState<string | null>(null);
    const [erro, setErro] = useState<string | null>(null);
    const [mensagem, setMensagem] = useState<string | null>(null);

    const fetchInscricoes = useCallback(async () => {
        setLoading(true);
        setErro(null);
        try {
            const res = await fetch('/api/inscricoes/minhas');
            if (res.status === 401) {
                setErro('Você precisa estar logado para ver suas inscrições.');
                return;
            }
            if (!res.ok) throw new Error('Erro ao buscar inscrições');
            const data = await res.json();
            setInscricoes(data.data || []);
        } catch {
            setErro('Erro ao carregar suas inscrições. Tente recarregar a página.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchInscricoes();
    }, [fetchInscricoes]);

    const handleCancelar = async (inscricaoId: string) => {
        if (!confirm('Tem certeza que deseja cancelar esta inscrição?')) return;
        setCancelando(inscricaoId);
        try {
            const res = await fetch('/api/inscricoes/cancelar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ inscricaoId }),
            });
            const data = await res.json();
            if (!res.ok) {
                setMensagem(`Erro: ${data.error || 'Não foi possível cancelar.'}`);
            } else {
                setMensagem('Inscrição cancelada com sucesso.');
                fetchInscricoes();
            }
        } catch {
            setMensagem('Erro de conexão. Tente novamente.');
        } finally {
            setCancelando(null);
            setTimeout(() => setMensagem(null), 4000);
        }
    };

    return (
        <div style={{ padding: '0 0 40px' }}>
            {/* Cabeçalho */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
                <Link
                    href="/inscricoes"
                    style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        color: '#09427d', textDecoration: 'none', fontSize: '14px', fontWeight: 600,
                        background: 'rgba(9,66,125,0.08)', borderRadius: '8px', padding: '7px 12px',
                    }}
                >
                    <ArrowLeft size={16} /> Voltar
                </Link>
                <div>
                    <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#09427d', margin: 0 }}>
                        Minhas Inscrições
                    </h2>
                    {!loading && (
                        <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0 0' }}>
                            {inscricoes.length} inscrição{inscricoes.length !== 1 ? 'ões' : ''} ativa{inscricoes.length !== 1 ? 's' : ''}
                        </p>
                    )}
                </div>
            </div>

            {/* Mensagem de feedback */}
            {mensagem && (
                <div style={{
                    background: mensagem.startsWith('Erro') ? '#fee2e2' : '#d1fae5',
                    color: mensagem.startsWith('Erro') ? '#991b1b' : '#065f46',
                    borderRadius: '10px', padding: '12px 16px', marginBottom: '16px',
                    fontSize: '14px', fontWeight: 500,
                }}>
                    {mensagem}
                </div>
            )}

            {/* Conteúdo */}
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
                    <Loader2 size={36} style={{ animation: 'spin 1s linear infinite', color: '#09427d' }} />
                </div>
            ) : erro ? (
                <div style={{
                    textAlign: 'center', padding: '40px 20px',
                    background: '#fee2e2', borderRadius: '16px', color: '#991b1b',
                }}>
                    <AlertCircle size={36} style={{ margin: '0 auto 12px', display: 'block' }} />
                    <p style={{ fontSize: '15px', fontWeight: 600, margin: 0 }}>{erro}</p>
                    {erro.includes('logado') && (
                        <a
                            href="/auth/login?returnTo=/inscricoes/minhas"
                            style={{
                                display: 'inline-block', marginTop: '16px',
                                background: '#09427d', color: '#fff',
                                borderRadius: '10px', padding: '10px 20px',
                                textDecoration: 'none', fontSize: '14px', fontWeight: 600,
                            }}
                        >
                            Fazer Login
                        </a>
                    )}
                </div>
            ) : inscricoes.length === 0 ? (
                <div style={{
                    textAlign: 'center', padding: '60px 20px',
                    background: 'rgba(9,66,125,0.04)', borderRadius: '16px', color: '#6b7280',
                }}>
                    <Calendar size={48} style={{ margin: '0 auto 16px', opacity: 0.4, display: 'block' }} />
                    <p style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>Você não possui inscrições ativas</p>
                    <p style={{ fontSize: '14px', margin: '8px 0 16px' }}>Explore os eventos disponíveis e inscreva-se!</p>
                    <Link
                        href="/inscricoes"
                        style={{
                            background: '#09427d', color: '#fff', textDecoration: 'none',
                            borderRadius: '10px', padding: '10px 20px',
                            fontSize: '14px', fontWeight: 600, display: 'inline-block',
                        }}
                    >
                        Ver Eventos
                    </Link>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {inscricoes.map((inscricao) => {
                        const evento = typeof inscricao.eventId === 'object' ? inscricao.eventId : null;
                        return (
                            <div
                                key={inscricao._id}
                                style={{
                                    background: '#fff',
                                    borderRadius: '14px',
                                    padding: '20px 24px',
                                    boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
                                    border: '1.5px solid #e5e7eb',
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    justifyContent: 'space-between',
                                    gap: '16px',
                                    flexWrap: 'wrap',
                                }}
                            >
                                <div style={{ flex: 1, minWidth: '200px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '8px' }}>
                                        <StatusBadge status={inscricao.status} />
                                        {evento?.isPaid && (
                                            <span style={{
                                                background: '#fef3c7', color: '#92400e',
                                                borderRadius: '999px', padding: '3px 10px',
                                                fontSize: '12px', fontWeight: 600,
                                            }}>
                                                Pago
                                            </span>
                                        )}
                                    </div>

                                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#09427d', margin: '0 0 4px' }}>
                                        {evento?.eventName ?? 'Evento'}
                                    </h3>

                                    {evento?.eventDescription && (
                                        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 8px', lineHeight: 1.5 }}>
                                            {evento.eventDescription.length > 120
                                                ? evento.eventDescription.slice(0, 120) + '...'
                                                : evento.eventDescription}
                                        </p>
                                    )}

                                    <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>
                                        Inscrito em: {formatDate(inscricao.registeredAt)}
                                    </p>
                                </div>

                                {inscricao.status !== 'cancelled' && (
                                    <button
                                        onClick={() => handleCancelar(inscricao._id)}
                                        disabled={cancelando === inscricao._id}
                                        style={{
                                            background: cancelando === inscricao._id ? '#f3f4f6' : '#fee2e2',
                                            color: cancelando === inscricao._id ? '#9ca3af' : '#dc2626',
                                            border: 'none', borderRadius: '10px',
                                            padding: '9px 14px', fontSize: '13px', fontWeight: 600,
                                            cursor: cancelando === inscricao._id ? 'not-allowed' : 'pointer',
                                            display: 'flex', alignItems: 'center', gap: '6px',
                                            whiteSpace: 'nowrap',
                                            transition: 'background 0.2s',
                                        }}
                                    >
                                        {cancelando === inscricao._id ? (
                                            <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                                        ) : (
                                            <Trash2 size={14} />
                                        )}
                                        Cancelar
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
