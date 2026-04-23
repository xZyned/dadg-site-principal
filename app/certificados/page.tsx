'use client'
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { Poppins } from "next/font/google";
import "../globals.css";

import { ICertificate } from "../lib/models/CertificateModel";

const stylePoppins = Poppins({
  subsets: ["latin", "latin-ext"],
  weight: [
    "100",
    "200",
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
    "900",
  ],
  style: ["normal", "italic"],
});

// Componente do Gradiente de Fundo (apenas tons de azul com mais variações)
function GradientBackground() {
  useEffect(() => {
    // Array com mais tons de azul para uma transição mais nítida
    const colors = [
      [0, 51, 102],    // Azul profundo
      [0, 102, 204],   // Azul médio
      [0, 128, 255],   // Azul brilhante
      [30, 144, 255],  // Dodger Blue
      [70, 130, 180],  // Steel Blue
      [135, 206, 235], // Sky Blue
      [173, 216, 230]  // Azul claro
    ];

    let step = 0;
    // Índices das cores: [atual esquerda, próxima esquerda, atual direita, próxima direita]
    const colorIndices = [0, 1, 2, 3];
    const gradientSpeed = 0.002;

    function updateGradient() {
      const c0_0 = colors[colorIndices[0]];
      const c0_1 = colors[colorIndices[1]];
      const c1_0 = colors[colorIndices[2]];
      const c1_1 = colors[colorIndices[3]];

      const istep = 1 - step;
      const r1 = Math.round(istep * c0_0[0] + step * c0_1[0]);
      const g1 = Math.round(istep * c0_0[1] + step * c0_1[1]);
      const b1 = Math.round(istep * c0_0[2] + step * c0_1[2]);
      const color1 = `rgb(${r1},${g1},${b1})`;

      const r2 = Math.round(istep * c1_0[0] + step * c1_1[0]);
      const g2 = Math.round(istep * c1_0[1] + step * c1_1[1]);
      const b2 = Math.round(istep * c1_0[2] + step * c1_1[2]);
      const color2 = `rgb(${r2},${g2},${b2})`;

      const gradientDiv = document.getElementById("gradient");
      if (gradientDiv) {
        gradientDiv.style.background = `-webkit-gradient(linear, left top, right top, from(${color1}), to(${color2}))`;
        gradientDiv.style.background = `-moz-linear-gradient(left, ${color1} 0%, ${color2} 100%)`;
      }

      step += gradientSpeed;
      if (step >= 1) {
        step %= 1;
        colorIndices[0] = colorIndices[1];
        colorIndices[2] = colorIndices[3];
        colorIndices[1] = (colorIndices[1] + Math.floor(1 + Math.random() * (colors.length - 1))) % colors.length;
        colorIndices[3] = (colorIndices[3] + Math.floor(1 + Math.random() * (colors.length - 1))) % colors.length;
      }
    }
    const intervalId = setInterval(updateGradient, 10);
    return () => clearInterval(intervalId);
  }, []);
  return <div id="gradient" />;
}

// Componente Loader via Portal
function Loader() {
  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="loader animate-spin">
        <svg className="circular" viewBox="25 25 50 50">
          <circle
            className="path"
            cx="50"
            cy="50"
            r="20"
            fill="none"
            strokeWidth="2"
            strokeMiterlimit="10"
          />
        </svg>
      </div>
    </div>,
    document.body
  );
}

// Componente de Pesquisa e Exibição de Certificados
function SearchInput() {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [data, setData] = useState<ICertificate[]>([]);
  const [/*downloadingId*/, setDownloadingId] = useState<string | null>(null);

  // Restaura estado salvo ao montar o componente
  useEffect(() => {
    const savedSearch = localStorage.getItem('certificateSearch');
    const savedResults = localStorage.getItem('certificateResults');

    if (savedSearch) {
      setInputValue(savedSearch);
    }

    if (savedResults) {
      try {
        const parsedResults = JSON.parse(savedResults);
        setData(parsedResults);

        // Scroll para os resultados após um pequeno delay para garantir que o DOM está renderizado
        setTimeout(() => {
          const resultsContainer = document.querySelector('[data-results-container]');
          if (resultsContainer) {
            resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      } catch (e) {
        // Ignora erro de parsing
      }
    }
  }, []);

  const handleSearch = async () => {
    setData([]);
    setIsLoading(true);
    setNoResults(false);

    try {
      const response = await fetch(`/api/get/myCertificate/${inputValue}`);
      const result: { data: ICertificate[] } = await response.json();

      if (!response.ok) {
        setNoResults(true);
        localStorage.removeItem('certificateSearch');
        localStorage.removeItem('certificateResults');
      } else {
        setData(result.data);
        // Salva o termo de busca e resultados
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
  /*
  const handleDownload = async (certificateId: string, eventName: string, ownerName: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setDownloadingId(certificateId);
    try {
      const response = await fetch(`/api/get/downloadCertificate/${certificateId}`);

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        alert(errData.message || 'Erro ao baixar certificado. Tente novamente.');
        return;
      }

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${eventName} - ${ownerName}.pdf`;
      link.click();
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Erro ao baixar:', error);
      alert('Erro ao baixar certificado. Tente novamente.');
    } finally {
      setDownloadingId(null);
    }
  };
  */
  return (
    <div className="flex flex-col items-center space-y-5">
      {/* Input com transição suave */}
      <div className="w-full">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && inputValue.trim() !== "") {
              handleSearch();
            }
          }}
          className="border border-blue-800 p-2.5 sm:p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 shadow-sm text-sm sm:text-base"
          placeholder="Pressione 'Enter' para pesquisar..."
        />
      </div>
      {isLoading && <Loader />}
      {noResults && (
        <div className="mt-4 text-red-600 font-medium">
          Nenhum resultado encontrado.
        </div>
      )}
      {!noResults && data.length > 0 && (
        <div className="w-full max-h-64 overflow-auto space-y-2 mt-4" data-results-container>
          {data.map((certificate) => (
            <div
              key={String(certificate._id)}
              className="border border-gray-200 rounded-xl p-3 sm:p-4 bg-gray-50 transition duration-300 ease-in-out hover:bg-blue-50 hover:shadow-lg relative group"
            >
              <Link
                prefetch={true}
                href={`/certificados/meuCertificado/${String(certificate._id)}`}
                className="block"
              >
                <h1 className="font-extrabold text-sm sm:text-base md:text-lg text-blue-900 break-words pr-20">
                  {certificate.eventName}
                </h1>
                <div className="flex flex-col sm:flex-row justify-between text-xs sm:text-sm text-gray-700 mt-2 gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="uppercase tracking-wide text-xs">Titular</p>
                    <p className="font-medium break-words">{certificate.ownerName}</p>
                  </div>
                  <div className="min-w-0 flex-1 sm:flex-none">
                    <p className="uppercase tracking-wide text-xs">Código Verificador</p>
                    <p className="font-medium break-all text-xs">{String(certificate._id)}</p>
                  </div>
                </div>
              </Link>
              {/*
              <button
                onClick={(e) => handleDownload(String(certificate._id), certificate.eventName, certificate.ownerName, e)}
                disabled={downloadingId === String(certificate._id)}
                className="absolute top-3 right-3 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg z-10"
                title="Baixar certificado"
              >
              {downloadingId === String(certificate._id) ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              )}
            </button>
                  */}
            </div>
          ))}
        </div>
      )
      }
    </div >
  );
}

// Página principal com o gradiente de fundo e o conteúdo sobreposto
export default function Home() {
  return (
    <div className="relative min-h-screen w-full">
      {/* Componente de fundo com gradiente */}
      <GradientBackground />
      {/* Conteúdo centralizado e sobreposto ao fundo */}
      <main className={`absolute inset-0 flex items-center justify-center p-4 sm:p-6 ${stylePoppins.className}`}>
        <div className="w-full max-w-md sm:max-w-lg bg-white shadow-2xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 z-10">
          <article className="space-y-4 sm:space-y-5 text-center">
            <div className="flex items-center justify-center">
              <Image
                className="rounded-full"
                width={80}
                height={80}
                alt="Logo"
                src="/logoDadg02.png"
                style={{ width: 'auto', height: 'auto' }}
              />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-blue-900 px-2">
                {`Validação de Certificados`.toLocaleUpperCase()}
              </h1>
              <h2 className="font-medium text-gray-600 text-xs sm:text-sm md:text-base mt-2">
                Pesquise usando: Nome
              </h2>
            </div>
          </article>
          <article className="mt-4 sm:mt-6">
            <SearchInput />
          </article>
        </div>
      </main>
    </div>
  );
}
