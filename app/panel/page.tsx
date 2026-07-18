import Link from 'next/link';

export default function PanelPage() {
    return (
        <main className="page-shell min-h-screen space-y-6 pb-16 pt-28">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Painel do usuário</h1>
            <p className="max-w-2xl text-slate-600 dark:text-slate-300">Acesse suas inscrições, histórico de eventos, certificados e artigos salvos.</p>
            <div className="flex flex-wrap gap-3">
                <Link href="/panel/eventos/inscricoes" className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white">Gerenciar eventos</Link>
                <Link href="/perfil" className="rounded-xl border border-slate-300 px-5 py-3 font-semibold dark:border-slate-700">Abrir perfil</Link>
            </div>
        </main>
    );
}
