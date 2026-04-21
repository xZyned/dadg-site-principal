'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Users, Tag, CheckCircle, Clock, AlertCircle, X, Loader2, LogIn } from 'lucide-react';

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface Modality {
    name: string;
    code: string;
    description: string;
}

interface Evento {
    _id: string;
    eventName: string;
    eventDescription: string;
    eventType?: string;
    isPaid: boolean;
    price?: number;
    maxParticipants?: number;
    registrationCount?: number;
    modalities?: Modality[];
    submission_deadline?: string;
    createdAt?: string;
}

interface InscricaoForm {
    selectedModalityCode: string;
    userCpf: string;
    userPhone: string;
    notes: string;
}

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: number;
    type: ToastType;
    message: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function vagasRestantes(evento: Evento): number | null {
    if (evento.maxParticipants == null) return null;
    const count = evento.registrationCount ?? 0;
    return Math.max(0, evento.maxParticipants - count);
}

function badgeEventType(tipo?: string) {
    if (!tipo || tipo === 'undefined') return null;
    const map: Record<string, string> = {
        WORKSHOP: '#7c3aed',
        Palestra: '#0891b2',
        Curso: '#059669',
        Assembleia: '#d97706',
        Evento: '#09427d',
    };
    const color = map[tipo] ?? '#09427d';
    return (
        <span
            style={{
                background: color,
                color: '#fff',
                borderRadius: '999px',
                padding: '2px 12px',
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.04em',
                display: 'inline-block',
            }}
        >
            {tipo}
        </span>
    );
}

function formatDate(dateStr?: string) {
    if (!dateStr) return 'Data não informada';
    try {
        return new Date(dateStr).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch {
        return dateStr;
    }
}

// ─── Componente Toast ─────────────────────────────────────────────────────────

function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: number) => void }) {
    return (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {toasts.map((t) => (
                <div
                    key={t.id}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '14px 18px',
                        borderRadius: '12px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.18)',
                        background: t.type === 'success' ? '#166534' : t.type === 'error' ? '#991b1b' : '#1e40af',
                        color: '#fff',
                        minWidth: '280px',
                        maxWidth: '380px',
                        fontSize: '14px',
                        fontWeight: 500,
                        animation: 'slideInRight 0.3s ease',
                    }}
                >
                    {t.type === 'success' && <CheckCircle size={18} />}
                    {t.type === 'error' && <AlertCircle size={18} />}
                    {t.type === 'info' && <Clock size={18} />}
                    <span style={{ flex: 1 }}>{t.message}</span>
                    <button
                        onClick={() => onRemove(t.id)}
                        style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', padding: 0 }}
                    >
                        <X size={16} />
                    </button>
                </div>
            ))}
            <style>{`@keyframes slideInRight { from { transform: translateX(400px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
        </div>
    );
}

// ─── Modal de Inscrição ────────────────────────────────────────────────────────

interface ModalInscricaoProps {
    evento: Evento;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (form: InscricaoForm) => Promise<void>;
    isLoading: boolean;
}

function ModalInscricao({ evento, isOpen, onClose, onSubmit, isLoading }: ModalInscricaoProps) {
    const [form, setForm] = useState<InscricaoForm>({
        selectedModalityCode: '',
        userCpf: '',
        userPhone: '',
        notes: '',
    });

    useEffect(() => {
        if (evento.modalities && evento.modalities.length > 0) {
            setForm((prev) => ({
                ...prev,
                selectedModalityCode: evento.modalities![0].code,
            }));
        }
    }, [evento]);

    if (!isOpen) return null;

    const handleChange = (field: keyof InscricaoForm, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(form);
    };

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: '20px',
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: '#fff',
                    borderRadius: '16px',
                    padding: '32px',
                    maxWidth: '500px',
                    width: '100%',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#09427d', margin: 0 }}>
                        Inscrever-se em {evento.eventName}
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '24px',
                            cursor: 'pointer',
                            color: '#6b7280',
                        }}
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* Seleção de Modalidade */}
                    {evento.modalities && evento.modalities.length > 0 && (
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                                Modalidade *
                            </label>
                            <select
                                value={form.selectedModalityCode}
                                onChange={(e) => handleChange('selectedModalityCode', e.target.value)}
                                required
                                style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    borderRadius: '8px',
                                    border: '1.5px solid #e5e7eb',
                                    fontSize: '14px',
                                    fontFamily: 'inherit',
                                    cursor: 'pointer',
                                }}
                            >
                                {evento.modalities.map((m) => (
                                    <option key={m.code} value={m.code}>
                                        {m.name} - {m.description}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* CPF */}
                    <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                            CPF (opcional)
                        </label>
                        <input
                            type="text"
                            placeholder="000.000.000-00"
                            value={form.userCpf}
                            onChange={(e) => handleChange('userCpf', e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px 12px',
                                borderRadius: '8px',
                                border: '1.5px solid #e5e7eb',
                                fontSize: '14px',
                                fontFamily: 'inherit',
                            }}
                        />
                    </div>

                    {/* Telefone */}
                    <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                            Telefone (opcional)
                        </label>
                        <input
                            type="tel"
                            placeholder="(XX) XXXXX-XXXX"
                            value={form.userPhone}
                            onChange={(e) => handleChange('userPhone', e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px 12px',
                                borderRadius: '8px',
                                border: '1.5px solid #e5e7eb',
                                fontSize: '14px',
                                fontFamily: 'inherit',
                            }}
                        />
                    </div>

                    {/* Observações */}
                    <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                            Observações (opcional)
                        </label>
                        <textarea
                            placeholder="Deixe suas observações ou dúvidas aqui..."
                            value={form.notes}
                            onChange={(e) => handleChange('notes', e.target.value)}
                            rows={3}
                            style={{
                                width: '100%',
                                padding: '10px 12px',
                                borderRadius: '8px',
                                border: '1.5px solid #e5e7eb',
                                fontSize: '14px',
                                fontFamily: 'inherit',
                                resize: 'vertical',
                            }}
                        />
                    </div>

                    {/* Botões */}
                    <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            style={{
                                flex: 1,
                                padding: '10px 16px',
                                borderRadius: '10px',
                                border: '1.5px solid #e5e7eb',
                                background: '#fff',
                                color: '#374151',
                                fontSize: '14px',
                                fontWeight: 600,
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                opacity: isLoading ? 0.6 : 1,
                            }}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            style={{
                                flex: 1,
                                padding: '10px 16px',
                                borderRadius: '10px',
                                border: 'none',
                                background: '#09427d',
                                color: '#fff',
                                fontSize: '14px',
                                fontWeight: 600,
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                opacity: isLoading ? 0.7 : 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                            }}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                                    Inscrevendo...
                                </>
                            ) : (
                                'Inscrever-se'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ─── Componente Principal ──────────────────────────────────────────────────────

export default function EventosInscricao() {
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [toasts, setToasts] = useState<Toast[]>([]);
    const [selectedEvento, setSelectedEvento] = useState<Evento | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchEventos = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/get/eventosAbertos');
            if (!res.ok) throw new Error('Erro ao buscar eventos');
            const data = await res.json();
            setEventos(data.data || []);
        } catch {
            addToast('Erro ao carregar eventos. Tente recarregar a página.', 'error');
        } finally {
            setLoading(false);
        }
    }, []);

    const checkAuth = useCallback(async () => {
        try {
            const res = await fetch('/api/inscricoes/minhas');
            setIsAuthenticated(res.status !== 401);
        } catch {
            setIsAuthenticated(false);
        }
    }, []);

    useEffect(() => {
        fetchEventos();
        checkAuth();
    }, [fetchEventos, checkAuth]);

    const addToast = (message: string, type: ToastType) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, type, message }]);
        setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
    };

    const handleInscricao = async (form: InscricaoForm) => {
        if (!selectedEvento) return;

        setIsSubmitting(true);
        try {
            const res = await fetch('/api/inscricoes/eventos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    eventId: selectedEvento._id,
                    selectedModalityCode: form.selectedModalityCode,
                    userCpf: form.userCpf,
                    userPhone: form.userPhone,
                    notes: form.notes,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                addToast(data.error || 'Erro ao realizar inscrição', 'error');
                return;
            }

            addToast(data.message || 'Inscrição realizada com sucesso!', 'success');
            setIsModalOpen(false);
            setSelectedEvento(null);
            fetchEventos();
        } catch {
            addToast('Erro de conexão. Tente novamente.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const openModal = (evento: Evento) => {
        if (!isAuthenticated) {
            window.location.href = '/auth/login?returnTo=/inscricoes';
            return;
        }
        setSelectedEvento(evento);
        setIsModalOpen(true);
    };

    return (
        <div style={{ padding: '0 0 40px' }}>
            {/* Cabeçalho */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
                <div>
                    <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#09427d', margin: 0 }}>
                        Inscrição de Eventos Abertos
                    </h2>
                    {!loading && (
                        <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0 0' }}>
                            {eventos.length} evento{eventos.length !== 1 ? 's' : ''} disponível{eventos.length !== 1 ? 'is' : ''}
                        </p>
                    )}
                </div>

                {isAuthenticated && (
                    <a
                        href="/inscricoes/minhas"
                        style={{
                            background: '#09427d',
                            color: '#fff',
                            textDecoration: 'none',
                            borderRadius: '10px',
                            padding: '9px 18px',
                            fontSize: '14px',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            marginLeft: 'auto',
                        }}
                    >
                        <Calendar size={16} /> Minhas Inscrições em Eventos
                    </a>
                )}

                {!isAuthenticated && (
                    <a
                        href="/auth/login?returnTo=/inscricoes"
                        style={{
                            background: '#09427d',
                            color: '#fff',
                            textDecoration: 'none',
                            borderRadius: '10px',
                            padding: '9px 18px',
                            fontSize: '14px',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            marginLeft: 'auto',
                        }}
                    >
                        <LogIn size={16} /> Fazer Login
                    </a>
                )}
            </div>

            {/* Conteúdo */}
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
                    <Loader2 size={36} style={{ animation: 'spin 1s linear infinite', color: '#09427d' }} />
                </div>
            ) : eventos.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '60px 20px',
                    background: 'rgba(9,66,125,0.04)',
                    borderRadius: '16px',
                    color: '#6b7280',
                }}>
                    <Calendar size={48} style={{ margin: '0 auto 16px', opacity: 0.4, display: 'block' }} />
                    <p style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>Nenhum evento aberto no momento</p>
                    <p style={{ fontSize: '14px', margin: '8px 0' }}>Volte em breve para conferir novas inscrições</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                    {eventos.map((evento) => {
                        const vagas = vagasRestantes(evento);
                        const vagasEsgotadas = vagas === 0;

                        return (
                            <div
                                key={evento._id}
                                style={{
                                    background: '#fff',
                                    borderRadius: '14px',
                                    padding: '20px',
                                    boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
                                    border: '1.5px solid #e5e7eb',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: 'all 0.3s ease',
                                    opacity: vagasEsgotadas ? 0.7 : 1,
                                }}
                            >
                                {/* Header */}
                                <div style={{ marginBottom: '12px' }}>
                                    {evento.eventType && badgeEventType(evento.eventType)}
                                </div>

                                {/* Título */}
                                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#09427d', margin: '0 0 8px' }}>
                                    {evento.eventName}
                                </h3>

                                {/* Descrição */}
                                <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 12px', lineHeight: 1.5 }}>
                                    {evento.eventDescription.length > 100
                                        ? evento.eventDescription.slice(0, 100) + '...'
                                        : evento.eventDescription}
                                </p>

                                {/* Informações */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px', fontSize: '13px', color: '#6b7280' }}>
                                    {evento.modalities && evento.modalities.length > 0 && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Tag size={14} />
                                            <span>{evento.modalities.length} modalidade{evento.modalities.length !== 1 ? 's' : ''}</span>
                                        </div>
                                    )}

                                    {vagas !== null && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Users size={14} />
                                            <span>{vagas} vaga{vagas !== 1 ? 's' : ''} disponível{vagas !== 1 ? 'is' : ''}</span>
                                        </div>
                                    )}

                                    {evento.submission_deadline && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Clock size={14} />
                                            <span>Prazo: {formatDate(evento.submission_deadline)}</span>
                                        </div>
                                    )}

                                    {evento.isPaid && evento.price && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#d97706', fontWeight: 600 }}>
                                            <Tag size={14} />
                                            <span>R$ {evento.price.toFixed(2)}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Botão */}
                                <button
                                    onClick={() => openModal(evento)}
                                    disabled={vagasEsgotadas}
                                    style={{
                                        marginTop: 'auto',
                                        background: vagasEsgotadas ? '#d1d5db' : '#09427d',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '10px',
                                        padding: '10px 16px',
                                        fontSize: '14px',
                                        fontWeight: 600,
                                        cursor: vagasEsgotadas ? 'not-allowed' : 'pointer',
                                        transition: 'background 0.2s',
                                    }}
                                >
                                    {vagasEsgotadas ? 'Vagas Esgotadas' : 'Inscrever-se'}
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modal de Inscrição */}
            {selectedEvento && (
                <ModalInscricao
                    evento={selectedEvento}
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedEvento(null);
                    }}
                    onSubmit={handleInscricao}
                    isLoading={isSubmitting}
                />
            )}

            {/* Toast Container */}
            <ToastContainer toasts={toasts} onRemove={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
