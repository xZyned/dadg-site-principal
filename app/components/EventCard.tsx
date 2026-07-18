"use client";

import { useState } from "react";
import {
    CalendarDays,
    Users,
    CircleDollarSign,
    CheckCircle2,
    Loader2,
    Info,
    Gift,
    X,
    User,
    CreditCard,
    Mail,
} from "lucide-react";
import { useRouter } from "next/navigation";

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
    /** E-mail já autenticado do Auth0 — pré-preenche o campo */
    userEmail?: string | null;
}

export default function EventCard({
    event,
    isSubscribed: initialSubscribed,
    isLoggedIn,
    accessToken,
    userEmail,
}: EventCardProps) {
    const router = useRouter();
    const [isSubscribed, setIsSubscribed] = useState(initialSubscribed);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    // Modal de dados complementares
    const [showModal, setShowModal] = useState(false);
    const [modalStep, setModalStep] = useState<1 | 2>(1);
    const [cpf, setCpf] = useState("");
    const [email, setEmail] = useState(userEmail || "");
    const [cpfError, setCpfError] = useState("");

    const formatCurrency = (value?: number) => {
        if (typeof value !== "number") return "Valor não informado";
        return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
    };

    const formatCpf = (raw: string) => {
        const digits = raw.replace(/\D/g, "").slice(0, 11);
        return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, (_, a, b, c, d) =>
            d ? `${a}.${b}.${c}-${d}` : c ? `${a}.${b}.${c}` : b ? `${a}.${b}` : a
        );
    };

    const handleEnrollClick = () => {
        if (!isLoggedIn || !accessToken) {
            window.location.href = "/api/auth/login?returnTo=/eventos";
            return;
        }
        if (isSubscribed) {
            // Cancelar não precisa de modal
            handleSubmitEnrollment("", "");
            return;
        }
        // Abre modal para coleta de CPF/email
        const savedCpf = typeof window !== 'undefined' ? localStorage.getItem('dadg_saved_cpf') || "" : "";
        const savedEmail = typeof window !== 'undefined' ? localStorage.getItem('dadg_saved_email') || userEmail || "" : userEmail || "";
        setEmail(savedEmail);
        setCpf(savedCpf);
        setCpfError("");
        setErrorMsg("");
        setModalStep(1);
        setShowModal(true);
    };

    const handleModalConfirm = () => {
        if (modalStep === 1) {
            setModalStep(2);
            return;
        }

        const cpfDigits = cpf.replace(/\D/g, "");
        if (!cpfDigits || cpfDigits.length !== 11) {
            setCpfError("Informe um CPF válido com 11 dígitos.");
            return;
        }
        if (!email || !email.includes("@")) {
            setCpfError("Informe um e-mail válido.");
            return;
        }
        
        if (typeof window !== 'undefined') {
            localStorage.setItem('dadg_saved_cpf', cpf);
            localStorage.setItem('dadg_saved_email', email);
        }

        setCpfError("");
        setShowModal(false);
        handleSubmitEnrollment(email.trim().toLowerCase(), cpfDigits);
    };

    const handleSubmitEnrollment = async (ownerEmail: string, ownerCpf: string) => {
        setIsLoading(true);
        setErrorMsg("");

        try {
            const endpoint = `/api/v1/events/${event._id}/registration`;
            const method = isSubscribed ? "DELETE" : "POST";

            const res = await fetch(endpoint, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
                },
                body: method === "POST" ? JSON.stringify({ ownerEmail, ownerCpf }) : undefined,
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
        <>
            <div className="glass-panel-strong surface-outline relative overflow-hidden rounded-2xl border border-white/90 dark:border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(243,247,252,0.94)_100%)] dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.92)_0%,rgba(2,6,23,0.86)_100%)] p-6 shadow-[0_24px_64px_rgba(4,26,49,0.14)] flex flex-col h-full transition-transform hover:-translate-y-1 hover:shadow-xl duration-300">
                <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                        <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/30 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:text-blue-300 ring-1 ring-inset ring-blue-700/10 dark:ring-blue-400/20">
                            {event.eventType}
                        </span>
                        {isSubscribed && (
                            <span className="flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                <CheckCircle2 size={14} className="mr-1" />Inscrito
                            </span>
                        )}
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 leading-tight">{event.eventName}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-6">{event.eventDescription}</p>

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
                                <Gift size={16} className="mr-2 text-blue-600 dark:text-blue-400" />Benefícios
                            </h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{event.eventBenefits}</p>
                        </div>
                    )}
                </div>

                {errorMsg && (
                    <div className="mb-4 flex items-start text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded-md">
                        <Info size={14} className="mr-1.5 flex-shrink-0 mt-0.5" /><span>{errorMsg}</span>
                    </div>
                )}

                <button
                    onClick={handleEnrollClick}
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

            {/* Modal de Dados Complementares */}
            {showModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="relative w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl flex flex-col gap-5"
                        onClick={e => e.stopPropagation()}
                        style={{ animation: "modalIn 0.2s ease" }}
                    >
                        {/* Fechar */}
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>

                        {/* Renderização condicional dos Passos do Modal */}
                        {modalStep === 1 ? (
                            <>
                                <div>
                                    <h2 className="text-lg font-bold text-white mb-1">Sobre o Evento</h2>
                                    <p className="text-sm text-slate-400">
                                        Leia os detalhes do evento antes de confirmar sua inscrição.
                                    </p>
                                </div>
                                <div className="rounded-xl bg-blue-950/40 border border-blue-800/30 px-4 py-3">
                                    <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-0.5">{event.eventType}</p>
                                    <p className="text-sm font-bold text-white">{event.eventName}</p>
                                </div>
                                <div className="max-h-48 overflow-y-auto pr-2 text-sm text-slate-300 whitespace-pre-wrap">
                                    {event.eventDescription}
                                </div>
                            </>
                        ) : (
                            <>
                                <div>
                                    <h2 className="text-lg font-bold text-white mb-1">Confirmar inscrição</h2>
                                    <p className="text-sm text-slate-400">
                                        Precisamos de alguns dados para emitir seu certificado ao final do evento.
                                    </p>
                                </div>

                                {/* Evento */}
                                <div className="rounded-xl bg-blue-950/40 border border-blue-800/30 px-4 py-3">
                                    <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-0.5">{event.eventType}</p>
                                    <p className="text-sm font-bold text-white">{event.eventName}</p>
                                </div>

                                {/* Campos */}
                                <div className="flex flex-col gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
                                            <Mail size={12} className="inline mr-1" />E-mail *
                                        </label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            placeholder="seu@email.com"
                                            className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
                                            <CreditCard size={12} className="inline mr-1" />CPF *
                                        </label>
                                        <input
                                            type="text"
                                            value={cpf}
                                            onChange={e => { setCpf(formatCpf(e.target.value)); setCpfError(""); }}
                                            placeholder="000.000.000-00"
                                            maxLength={14}
                                            className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition"
                                        />
                                        <p className="mt-1 text-xs text-slate-500">Usado exclusivamente para emissão do certificado.</p>
                                    </div>
                                </div>

                                {cpfError && (
                                    <div className="flex items-start gap-2 text-xs text-red-400 bg-red-950/30 border border-red-900/40 rounded-lg px-3 py-2">
                                        <Info size={13} className="flex-shrink-0 mt-0.5" />{cpfError}
                                    </div>
                                )}
                            </>
                        )}

                        <button
                            onClick={handleModalConfirm}
                            disabled={isLoading}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white py-3 text-sm font-semibold transition shadow-lg disabled:opacity-60"
                        >
                            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                            {modalStep === 1 ? "Aceitar Termos e Continuar" : "Confirmar Inscrição"}
                        </button>
                    </div>
                </div>
            )}

            <style jsx global>{`
                @keyframes modalIn {
                    from { opacity: 0; transform: scale(0.95) translateY(8px); }
                    to   { opacity: 1; transform: scale(1) translateY(0); }
                }
            `}</style>
        </>
    );
}
