import { Poppins } from 'next/font/google';
import { auth0 } from '../src/lib/auth0/Auth0Client';
import EventosInscricao from '../components/EventosInscricao';
import ParticlesInit from './ParticlesInit';
import './style.css';

const stylePoppins = Poppins({
    subsets: ['latin', 'latin-ext'],
    weight: ['300', '400', '500', '600', '700', '800'],
    style: ['normal', 'italic'],
});

export default async function InscricoesPage() {
    const session = await auth0.getSession();
    const isAuthenticated = !!session?.user;

    return (
        <div className="inscricoes-container" style={stylePoppins.style}>
            <div className="particles" id="particles-inscricoes"></div>
            <ParticlesInit />

            <div className="inscricoes-content">
                <div className="inscricoes-header">
                    <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-bold mb-4 tracking-wide">
                        INSCRIÇÃO DE EVENTOS
                    </h1>
                    <p className="inscricoes-subtitle">
                        Inscreva-se nos eventos, cursos e atividades do DADG
                    </p>
                    {!isAuthenticated && (
                        <p className="inscricoes-login-hint">
                            <a href="/auth/login?returnTo=/inscricoes" className="inscricoes-login-link">
                                Faça login
                            </a>{' '}
                            para realizar sua inscrição
                        </p>
                    )}
                </div>

                <div className="inscricoes-body">
                    <EventosInscricao isAuthenticated={isAuthenticated} />
                </div>
            </div>
        </div>
    );
}
