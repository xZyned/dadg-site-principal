import React from "react";
import "../../globals.css";

const CaepPage: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#000066]/80 to-[#000033]/90 flex justify-center py-16">
      <div className="max-w-7xl w-full px-6">
        {/* Header com Logo e Título */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 sm:mb-16 md:mb-20 gap-6 sm:gap-8">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-white mb-3 sm:mb-4 drop-shadow-lg animate-title-glow">
              CAEP
            </h1>
            <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 font-medium tracking-wide animate-slide-up px-4 md:px-0">
              Coordenadoria Acadêmica de Extensão e Pesquisa
            </h2>
          </div>
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.4)] border-4 border-blue-500 transform transition-all duration-700 hover:scale-105 hover:shadow-[0_0_50px_rgba(0,0,0,0.5)] hover:border-blue-400 animate-float">
            <img src="/coordinators/CAEP.png" alt="Ícone" className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
          </div>
        </div>

        {/* Grid Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 md:gap-8">
          {/* Coluna da Esquerda - Quem Somos */}
          <div className="lg:col-span-4">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-blue-300 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#000066]/95 backdrop-blur-md text-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.2)] h-full transform hover:scale-[1.02] transition-all duration-500 hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)] border border-blue-400/30 animate-slide-in-left delay-200">
                <div className="absolute inset-0 bg-[url('/grid-pattern.png')] opacity-10 rounded-2xl"></div>
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl"></div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-4 sm:mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200 animate-fade-in relative z-10">Quem Somos</h2>
                <p className="text-sm sm:text-base md:text-lg leading-relaxed animate-slide-in-left delay-300 relative z-10">
                  Somos a Coordenadoria Acadêmica de Extensão e Pesquisa, responsável por fomentar e coordenar as atividades de extensão e pesquisa na DADG.
                </p>
              </div>
            </div>
          </div>

          {/* Coluna do Meio - O que buscamos */}
          <div className="lg:col-span-4">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-300 to-blue-100 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-white/95 backdrop-blur-sm p-4 sm:p-6 md:p-8 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.15)] h-full transform hover:scale-[1.02] transition-all duration-500 hover:shadow-[0_12px_40px_rgba(0,0,0,0.25)] border border-blue-200 animate-slide-in-right delay-300">
                <div className="absolute top-0 left-0 w-24 h-24 bg-blue-200/20 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-blue-300/20 rounded-full blur-2xl"></div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 mb-4 sm:mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#000066] to-[#0000cc] animate-fade-in relative z-10">O que buscamos</h2>
                <p className="text-sm sm:text-base md:text-lg text-gray-800 leading-relaxed animate-slide-in-right delay-400 relative z-10">
                  Buscamos promover a integração entre ensino, pesquisa e extensão, desenvolvendo projetos que contribuam para o desenvolvimento acadêmico e social.
                </p>
              </div>
            </div>
          </div>

          {/* Coluna da Direita - Nossos valores */}
          <div className="lg:col-span-4">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-200 to-blue-50 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-gradient-to-br from-white/95 to-blue-50/90 backdrop-blur-sm p-4 sm:p-6 md:p-8 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.15)] h-full transform hover:scale-[1.02] transition-all duration-500 hover:shadow-[0_12px_40px_rgba(0,0,0,0.25)] border border-blue-200 animate-scale-in delay-400">
                <div className="absolute top-0 left-0 w-24 h-24 bg-blue-100/20 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-blue-200/20 rounded-full blur-2xl"></div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 mb-4 sm:mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#000066] to-[#0000cc] animate-fade-in relative z-10">Nossos valores</h2>
                <ul className="text-sm sm:text-base md:text-lg text-gray-800 space-y-3 sm:space-y-4 animate-scale-in delay-500 relative z-10">
                  <li className="flex items-center gap-2 sm:gap-3 group hover:translate-x-2 transition-transform duration-300">
                    <span className="text-blue-600 group-hover:scale-110 transition-transform duration-300 flex-shrink-0">✓</span>
                    <span className="group-hover:text-[#000066] transition-colors duration-300">Excelência acadêmica</span>
                  </li>
                  <li className="flex items-center gap-2 sm:gap-3 group hover:translate-x-2 transition-transform duration-300">
                    <span className="text-blue-600 group-hover:scale-110 transition-transform duration-300 flex-shrink-0">✓</span>
                    <span className="group-hover:text-[#000066] transition-colors duration-300">Inovação científica</span>
                  </li>
                  <li className="flex items-center gap-2 sm:gap-3 group hover:translate-x-2 transition-transform duration-300">
                    <span className="text-blue-600 group-hover:scale-110 transition-transform duration-300 flex-shrink-0">✓</span>
                    <span className="group-hover:text-[#000066] transition-colors duration-300">Compromisso social</span>
                  </li>
                  <li className="flex items-center gap-2 sm:gap-3 group hover:translate-x-2 transition-transform duration-300">
                    <span className="text-blue-600 group-hover:scale-110 transition-transform duration-300 flex-shrink-0">✓</span>
                    <span className="group-hover:text-[#000066] transition-colors duration-300">Integração com a comunidade</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Missão - Largura Total */}
        <div className="mt-6 sm:mt-8">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-blue-300 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-[#000066]/95 backdrop-blur-md text-white p-6 sm:p-8 md:p-12 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.2)] w-full text-center transform hover:scale-[1.02] transition-all duration-500 hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)] border border-blue-400/30 animate-slide-in-left delay-500">
              <div className="absolute inset-0 bg-[url('/grid-pattern.png')] opacity-10 rounded-2xl"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl"></div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4 sm:mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200 animate-fade-in relative z-10 px-4">Nossa missão</h2>
              <p className="text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl mx-auto animate-slide-in-left delay-600 relative z-10 px-4">
                Promover o desenvolvimento acadêmico através da integração entre ensino, pesquisa e extensão, contribuindo para a formação de profissionais comprometidos com a transformação social.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaepPage;
