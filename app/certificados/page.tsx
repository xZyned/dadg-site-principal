'use client'

import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, FileCheck2, Fingerprint } from "lucide-react";
import { ICertificate } from "../lib/models/CertificateModel";
import { useTheme } from "next-themes";

function Loader({ isDark }: { isDark: boolean }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  
  
  if (!mounted) return null;
  
  return ReactDOM.createPortal(
    <div className={`fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 transition-colors duration-500 ${isDark ? 'bg-[#001021]/80' : 'bg-white/80'}`}>
      <div className="flex flex-col items-center gap-4">
        <Loader2 className={`w-12 h-12 animate-spin transition-colors duration-500 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
        <span className={`font-medium tracking-widest uppercase text-sm transition-colors duration-500 ${isDark ? 'text-blue-200' : 'text-blue-800'}`}>Buscando...</span>
      </div>
    </div>,
    document.body
  );
}

function SearchInterface({ isDark }: { isDark: boolean }) {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [data, setData] = useState<ICertificate[]>([]);

  useEffect(() => {
    const savedSearch = localStorage.getItem('certificateSearch');
    const savedResults = localStorage.getItem('certificateResults');

    if (savedSearch) setInputValue(savedSearch);

    if (savedResults) {
      try {
        const parsedResults = JSON.parse(savedResults);
        setData(parsedResults);
      } catch (e) {
        // Ignora erro de parsing
      }
    }
  }, []);

  const handleSearch = async () => {
    if (!inputValue.trim()) return;
    
    setData([]);
    setIsLoading(true);
    setNoResults(false);

    try {
      const response = await fetch(`/api/get/myCertificate/${inputValue}`);
      const result: { data: ICertificate[] } = await response.json();

      if (!response.ok || result.data.length === 0) {
        setNoResults(true);
        localStorage.removeItem('certificateSearch');
        localStorage.removeItem('certificateResults');
      } else {
        setData(result.data);
        localStorage.setItem('certificateSearch', inputValue);
        localStorage.setItem('certificateResults', JSON.stringify(result.data));
      }
    } catch {
      setNoResults(true);
      localStorage.removeItem('certificateSearch');
      localStorage.removeItem('certificateResults');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center max-w-3xl mx-auto">
      {/* Barra de Pesquisa */}
      <div className="relative w-full max-w-md mx-auto group mb-10">
        <div className={`absolute -inset-1 bg-gradient-to-r ${isDark ? 'from-blue-500 to-blue-300' : 'from-blue-400 to-blue-600'} rounded-full blur opacity-25 group-hover:opacity-40 transition duration-500`}></div>
        <div className={`relative w-full backdrop-blur-xl border rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-colors duration-500 ${isDark ? 'bg-[#00152b]/90 border-white/20' : 'bg-white/90 border-blue-200/50'}`}>
          <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-500 ${isDark ? 'text-blue-300/70' : 'text-blue-500/70'}`}>
            <Fingerprint className="w-6 h-6" />
          </div>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            className={`w-full bg-transparent border-none rounded-full text-lg focus:outline-none focus:ring-0 py-4 pl-12 pr-16 transition-colors duration-500 ${isDark ? 'text-white placeholder-blue-200/40' : 'text-slate-900 placeholder-slate-400'}`}
            placeholder="Digite o Nome, CPF ou Código..."
          />
          <button
            onClick={handleSearch}
            className={`absolute right-1 top-1 bottom-1 aspect-square flex items-center justify-center rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] ${isDark ? 'bg-blue-600 hover:bg-blue-500 text-white border border-blue-400/30' : 'bg-[#002B5B] hover:bg-[#003B7B] text-white border border-[#002B5B]/30'}`}
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
      </div>

      {isLoading && <Loader isDark={isDark} />}

      {/* Resultados */}
      <AnimatePresence mode="wait">
        {noResults && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`w-full p-6 text-center rounded-2xl border backdrop-blur-md transition-colors duration-500 ${isDark ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-200'}`}
          >
            <p className={`font-medium text-lg transition-colors duration-500 ${isDark ? 'text-red-200' : 'text-red-600'}`}>Nenhum certificado encontrado para "{inputValue}".</p>
          </motion.div>
        )}

        {!noResults && data.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full grid grid-cols-1 gap-4"
          >
            <div className="text-left mb-2 px-2">
              <span className={`text-sm font-semibold uppercase tracking-widest transition-colors duration-500 ${isDark ? 'text-blue-300/80' : 'text-blue-700/80'}`}>
                {data.length} {data.length === 1 ? 'Certificado Encontrado' : 'Certificados Encontrados'}
              </span>
            </div>
            
            {data.map((certificate, i) => (
              <motion.div
                key={String(certificate._id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group relative"
              >
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${isDark ? 'from-blue-400/20' : 'from-blue-600/20'} to-transparent rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300`}></div>
                <Link
                  prefetch={true}
                  href={`/certificados/meuCertificado/${String(certificate._id)}`}
                  className={`relative block p-6 rounded-2xl backdrop-blur-md border transition-all duration-300 overflow-hidden ${isDark ? 'bg-white/[0.03] hover:bg-white/[0.08] border-white/10 hover:border-white/25' : 'bg-white/60 hover:bg-white border-blue-100 hover:border-blue-300 shadow-sm'}`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl shrink-0 transition-colors duration-500 ${isDark ? 'bg-blue-500/10' : 'bg-blue-100'}`}>
                        <FileCheck2 className={`w-8 h-8 transition-colors duration-500 ${isDark ? 'text-blue-300' : 'text-blue-600'}`} />
                      </div>
                      <div>
                        <h3 className={`text-xl font-bold font-serif leading-tight mb-2 pr-4 transition-colors duration-500 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {certificate.eventName}
                        </h3>
                        <div className="flex flex-wrap gap-x-6 gap-y-2">
                          <div>
                            <p className={`text-[10px] uppercase tracking-wider font-bold mb-0.5 transition-colors duration-500 ${isDark ? 'text-blue-300/60' : 'text-blue-500/80'}`}>Titular</p>
                            <p className={`text-sm transition-colors duration-500 ${isDark ? 'text-blue-100' : 'text-slate-700'}`}>{certificate.ownerName}</p>
                          </div>
                          <div>
                            <p className={`text-[10px] uppercase tracking-wider font-bold mb-0.5 transition-colors duration-500 ${isDark ? 'text-blue-300/60' : 'text-blue-500/80'}`}>Código</p>
                            <p className={`text-sm font-mono transition-colors duration-500 ${isDark ? 'text-blue-200/80' : 'text-slate-600'}`}>{String(certificate._id)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="shrink-0 sm:ml-auto w-full sm:w-auto">
                      <div className={`w-full sm:w-auto text-center px-4 py-2 text-sm font-bold rounded-lg border transition-colors ${isDark ? 'bg-blue-500/20 text-blue-200 border-blue-400/20 group-hover:bg-blue-600 group-hover:text-white' : 'bg-blue-100 text-blue-700 border-blue-200 group-hover:bg-blue-600 group-hover:text-white'}`}>
                        Visualizar
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CertificadosPage() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme !== 'light' : true;

  return (
    <main className={`min-h-screen flex flex-col pt-24 pb-20 overflow-x-hidden transition-colors duration-500 ${isDark ? 'bg-[#001021]' : 'bg-gray-50'}`}>
      {/* Background elements */}
      <div className={`absolute inset-0 bg-gradient-to-b ${isDark ? 'from-[#002B5B]/60' : 'from-blue-200/40'} to-transparent pointer-events-none transition-colors duration-500`} />
      <div className={`absolute inset-0 bg-[linear-gradient(to_right,${isDark ? '#ffffff05' : '#0000000a'}_1px,transparent_1px),linear-gradient(to_bottom,${isDark ? '#ffffff05' : '#0000000a'}_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none transition-colors duration-500`} />
      
      {/* Centralized Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-4xl mx-auto px-6 text-center mt-10 mb-12"
      >
        <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-serif tracking-tight drop-shadow-md transition-colors duration-500 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Validação de Certificados
        </h1>
        <p className={`text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto transition-colors duration-500 ${isDark ? 'text-blue-100/80' : 'text-slate-700'}`}>
          Acesse rapidamente seus certificados de participação em simpósios, ligas acadêmicas e eventos apoiados pelo DADG.
        </p>
      </motion.div>

      {/* Search Interface */}
      <section className="relative z-10 flex-grow px-4 sm:px-6 w-full">
        <SearchInterface isDark={isDark} />
      </section>
    </main>
  );
}
