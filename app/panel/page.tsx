'use client';

import React from 'react';
import Link from 'next/link';
import { Poppins } from 'next/font/google';
import { 
    User, 
    ClipboardList, 
    FileText, 
    LogOut, 
    Calendar,
    ChevronRight,
    Settings
} from 'lucide-react';
import { useUserContext } from '@/lib/userProvider';

const stylePoppins = Poppins({
    subsets: ['latin', 'latin-ext'],
    weight: ['400', '600', '700'],
});

export default function DashboardPage() {
    const { tokenVar } = useUserContext();

    // Como o auth0 v4 no server side já protege a rota via proxy.ts,
    // aqui no client podemos assumir que se chegou aqui, está autenticado.
    
    return (
        <main className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8" style={stylePoppins.style}>
            <div className="max-w-5xl mx-auto">
                {/* Header do Dashboard */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-8">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="h-20 w-20 bg-[#09427d] rounded-full flex items-center justify-center text-white">
                            <User size={40} />
                        </div>
                        <div className="text-center sm:text-left flex-1">
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Minha Conta</h1>
                            <p className="text-gray-500 mt-1">Bem-vindo ao seu painel de controle do DADG</p>
                        </div>
                        <div className="flex gap-3">
                            <a 
                                href="/auth/logout" 
                                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg font-semibold hover:bg-red-100 transition-colors"
                            >
                                <LogOut size={18} /> Sair
                            </a>
                        </div>
                    </div>
                </div>

                {/* Grid de Ações */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Card Inscrições */}
                    <Link href="/inscricoes/minhas" className="group">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-[#09427d] hover:shadow-md transition-all h-full flex flex-col">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-blue-50 text-[#09427d] rounded-xl group-hover:bg-[#09427d] group-hover:text-white transition-colors">
                                    <ClipboardList size={28} />
                                </div>
                                <ChevronRight className="text-gray-300 group-hover:text-[#09427d] group-hover:translate-x-1 transition-all" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Minhas Inscrições em Eventos</h2>
                            <p className="text-gray-600 flex-1">
                                Visualize e gerencie suas inscrições em eventos, cursos e workshops realizados pelo DADG.
                            </p>
                            <div className="mt-4 text-[#09427d] font-semibold flex items-center gap-1">
                                Acessar Inscrições
                            </div>
                        </div>
                    </Link>

                    {/* Card Certificados */}
                    <Link href="/certificados" className="group">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-[#09427d] hover:shadow-md transition-all h-full flex flex-col">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-green-50 text-green-600 rounded-xl group-hover:bg-green-600 group-hover:text-white transition-colors">
                                    <FileText size={28} />
                                </div>
                                <ChevronRight className="text-gray-300 group-hover:text-[#09427d] group-hover:translate-x-1 transition-all" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Meus Certificados</h2>
                            <p className="text-gray-600 flex-1">
                                Baixe seus certificados de participação e valide suas horas complementares.
                            </p>
                            <div className="mt-4 text-green-600 font-semibold flex items-center gap-1">
                                Ver certificados
                            </div>
                        </div>
                    </Link>

                    {/* Card Eventos */}
                    <Link href="/eventos" className="group">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-[#09427d] hover:shadow-md transition-all h-full flex flex-col">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-purple-50 text-purple-600 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                    <Calendar size={28} />
                                </div>
                                <ChevronRight className="text-gray-300 group-hover:text-[#09427d] group-hover:translate-x-1 transition-all" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Calendário de Eventos</h2>
                            <p className="text-gray-600 flex-1">
                                Veja o cronograma completo de eventos e atividades acadêmicas.
                            </p>
                            <div className="mt-4 text-purple-600 font-semibold flex items-center gap-1">
                                Ver Calendário
                            </div>
                        </div>
                    </Link>

                    {/* Card Configurações (Placeholder) */}
                    <div className="bg-gray-50 p-6 rounded-2xl border border-dashed border-gray-200 flex flex-col opacity-60">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-gray-100 text-gray-400 rounded-xl">
                                <Settings size={28} />
                            </div>
                        </div>
                        <h2 className="text-xl font-bold text-gray-400 mb-2">Perfil</h2>
                        <p className="text-gray-400 flex-1">
                            Em breve: gerencie seus dados cadastrais e preferências de notificação.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
