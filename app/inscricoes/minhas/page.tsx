import { redirect } from 'next/navigation';
import { Poppins } from 'next/font/google';
import { auth0 } from '../../src/lib/auth0/Auth0Client';
import MinhasInscricoes from '../../components/MinhasInscricoes';
import '../style.css';

const stylePoppins = Poppins({
    subsets: ['latin', 'latin-ext'],
    weight: ['300', '400', '500', '600', '700', '800'],
    style: ['normal', 'italic'],
});

export default async function MinhasInscricoesPage() {
    const session = await auth0.getSession();

    // Redirecionar para login se não autenticado
    if (!session?.user) {
        redirect('/auth/login?returnTo=/inscricoes/minhas');
    }

    return (
        <div className="inscricoes-container" style={stylePoppins.style}>
            <div className="inscricoes-content">
                <div className="inscricoes-header">
                    <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-bold mb-4 tracking-wide">
                        MINHAS INSCRIÇÕES EM EVENTOS
                    </h1>
                    <p className="inscricoes-subtitle">
                        Gerencie suas inscrições em eventos e cursos do DADG
                    </p>
                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', marginTop: '8px' }}>
                        Logado como: <strong>{session.user.name || session.user.email}</strong>
                    </p>
                </div>

                <div className="inscricoes-body">
                    <MinhasInscricoes />
                </div>
            </div>
        </div>
    );
}
