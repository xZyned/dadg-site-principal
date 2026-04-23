'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Poppins } from 'next/font/google';
import './styles/home.css';
import UpcomingSchedulePopup from './components/UpcomingSchedulePopup';

const stylePoppins = Poppins({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '600', '700'],
  style: ['normal'],
});

interface TypewriterProps {
  text: string;
  speed?: number;
}

function Typewriter({ text, speed = 100 }: TypewriterProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const randomDelay = speed + Math.random() * 50;
      const timeoutId = setTimeout(() => setIndex(index + 1), randomDelay);
      return () => clearTimeout(timeoutId);
    }
  }, [index, text, speed]);

  return (
    <span>
      {text.slice(0, index)}
      {index < text.length && <span className="blinking-cursor">|</span>}
    </span>
  );
}

function WaveAnimation() {
  return (
    <div className="absolute bottom-0 left-0 w-full pointer-events-none">
      <svg
        className="waves"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 24 150 28"
        preserveAspectRatio="none"
        shapeRendering="auto"
      >
        <defs>
          <path
            id="gentle-wave"
            d="M-160 44c30 0 58-18 88-18s58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
          />
        </defs>
        <g className="parallax">
          <use xlinkHref="#gentle-wave" x="48" y="0" fill="rgba(9,66,125,0.7)" />
          <use xlinkHref="#gentle-wave" x="48" y="3" fill="rgba(9,66,125,0.5)" />
          <use xlinkHref="#gentle-wave" x="48" y="5" fill="rgba(9,66,125,0.3)" />
          <use xlinkHref="#gentle-wave" x="48" y="7" fill="#09427d" />
        </g>
      </svg>
    </div>
  );
}

export default function Home() {
  return (
    <main
      className="home-background relative flex flex-col items-center justify-center min-h-screen w-full p-8"
      style={stylePoppins.style}
    >
      <UpcomingSchedulePopup />
      <div className="z-10 flex flex-col items-center text-center max-w-4xl mx-auto pb-20 sm:pb-32 px-4">
        <div className="home-logo-container relative w-24 h-24 sm:w-32 sm:h-32 mb-4 sm:mb-6">
          <Image
            src="/logoDadg02.png"
            alt="Logo Diretório Acadêmico"
            fill
            className="rounded-full object-cover"
          />
        </div>
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-[#09427d] mb-3 sm:mb-4 tracking-wide px-2">
          <Typewriter text="DIRETÓRIO ACADÊMICO DIOGO GUIMARÃES" speed={100} />
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-700 max-w-xl mb-6 sm:mb-8 px-4">
          Conectando estudantes e promovendo iniciativas inovadoras para o futuro.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8 w-full">
          <div className="home-card group relative p-3 sm:p-4 rounded-xl overflow-hidden">
            <div className="relative z-10 flex items-start gap-3 sm:gap-4">
              <div className="home-card-icon h-8 w-8 sm:h-10 sm:w-10 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#09427d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[#09427d] font-semibold mb-1 sm:mb-2 text-base sm:text-lg md:text-xl group-hover:text-[#073366] transition-colors duration-300">Certificados</h3>
                <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3 leading-relaxed">Acesse e baixe seus certificados de participação em eventos.</p>
                <Link href="/certificados" className="inline-flex items-center text-[#09427d] hover:text-[#073366] font-medium text-xs sm:text-sm group-hover:translate-x-2 transition-all duration-300">
                  Ver Certificados
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          <div className="home-card group relative p-3 sm:p-4 rounded-xl overflow-hidden">
            <div className="relative z-10 flex items-start gap-3 sm:gap-4">
              <div className="home-card-icon h-8 w-8 sm:h-10 sm:w-10 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#09427d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[#09427d] font-semibold mb-1 sm:mb-2 text-base sm:text-lg md:text-xl group-hover:text-[#073366] transition-colors duration-300">Coordenadorias</h3>
                <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3 leading-relaxed">Conheça nossas coordenadorias e suas atividades acadêmicas.</p>
                <Link href="/coordenadorias" className="inline-flex items-center text-[#09427d] hover:text-[#073366] font-medium text-xs sm:text-sm group-hover:translate-x-2 transition-all duration-300">
                  Ver Coordenadorias
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          <div className="home-card group relative p-3 sm:p-4 rounded-xl overflow-hidden">
            <div className="relative z-10 flex items-start gap-3 sm:gap-4">
              <div className="home-card-icon h-8 w-8 sm:h-10 sm:w-10 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#09427d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[#09427d] font-semibold mb-1 sm:mb-2 text-base sm:text-lg md:text-xl group-hover:text-[#073366] transition-colors duration-300">Calendário de Eventos</h3>
                <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3 leading-relaxed">Acompanhe os próximos eventos e atividades programadas.</p>
                <Link href="/eventos" className="inline-flex items-center text-[#09427d] hover:text-[#073366] font-medium text-xs sm:text-sm group-hover:translate-x-2 transition-all duration-300">
                  Ver Calendário
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          <div className="home-card group relative p-3 sm:p-4 rounded-xl overflow-hidden">
            <div className="relative z-10 flex items-start gap-3 sm:gap-4">
              <div className="home-card-icon h-8 w-8 sm:h-10 sm:w-10 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#09427d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[#09427d] font-semibold mb-1 sm:mb-2 text-base sm:text-lg md:text-xl group-hover:text-[#073366] transition-colors duration-300">Ouvidoria</h3>
                <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3 leading-relaxed">Envie sugestões, reclamações ou dúvidas. Sua voz é importante para o DADG.</p>
                <Link href="/ouvidoria" className="inline-flex items-center text-[#09427d] hover:text-[#073366] font-medium text-xs sm:text-sm group-hover:translate-x-2 transition-all duration-300">
                  Enviar manifestação
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          <div className="home-card group relative p-3 sm:p-4 rounded-xl overflow-hidden">
            <div className="relative z-10 flex items-start gap-3 sm:gap-4">
              <div className="home-card-icon h-8 w-8 sm:h-10 sm:w-10 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#09427d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[#09427d] font-semibold mb-1 sm:mb-2 text-base sm:text-lg md:text-xl group-hover:text-[#073366] transition-colors duration-300">Inscrição de Eventos</h3>
                <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3 leading-relaxed">Inscreva-se em cursos e eventos abertos pelo Diretório Acadêmico.</p>
                <Link href="/inscricoes" className="inline-flex items-center text-[#09427d] hover:text-[#073366] font-medium text-xs sm:text-sm group-hover:translate-x-2 transition-all duration-300">
                  Ver Inscrição de Eventos
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          <div className="home-card group relative p-3 sm:p-4 rounded-xl overflow-hidden">
            <div className="relative z-10 flex items-start gap-3 sm:gap-4">
              <div className="home-card-icon h-8 w-8 sm:h-10 sm:w-10 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#09427d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[#09427d] font-semibold mb-1 sm:mb-2 text-base sm:text-lg md:text-xl group-hover:text-[#073366] transition-colors duration-300">Sobre Nós</h3>
                <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3 leading-relaxed">Conheça nossa história, missão e valores do Diretório Acadêmico.</p>
                <Link href="/sobre" className="inline-flex items-center text-[#09427d] hover:text-[#073366] font-medium text-xs sm:text-sm group-hover:translate-x-2 transition-all duration-300">
                  Saiba mais
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          <div className="home-card group relative p-3 sm:p-4 rounded-xl overflow-hidden">
            <div className="relative z-10 flex items-start gap-3 sm:gap-4">
              <div className="home-card-icon h-8 w-8 sm:h-10 sm:w-10 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#09427d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[#09427d] font-semibold mb-1 sm:mb-2 text-base sm:text-lg md:text-xl group-hover:text-[#073366] transition-colors duration-300">Contato</h3>
                <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3 leading-relaxed">Redes sociais e e-mail. Fale conosco e acompanhe nossas novidades.</p>
                <Link href="/contato" className="inline-flex items-center text-[#09427d] hover:text-[#073366] font-medium text-xs sm:text-sm group-hover:translate-x-2 transition-all duration-300">
                  Entre em contato
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <WaveAnimation />
    </main>
  );
}
