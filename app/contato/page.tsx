'use client'
import React from 'react';
import Link from 'next/link';
import { Poppins } from 'next/font/google';
import { FaInstagram } from 'react-icons/fa';

const poppins = Poppins({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '600', '700'],
  style: ['normal'],
});

const instagramAccounts = [
  {
    name: "DADG ImePAC",
    handle: "@dadg.imepac",
    url: "https://instagram.com/dadg.imepac"
  },
  {
    name: "CAEP ImePAC",
    handle: "@caep.imepac",
    url: "https://instagram.com/caep.imepac"
  },
  {
    name: "CLAM ImePAC",
    handle: "@clam.imepac",
    url: "https://instagram.com/clam.imepac"
  },
  {
    name: "CLEVI ImePAC Araguari",
    handle: "@clevimepacaraguari",
    url: "https://instagram.com/clevimepacaraguari"
  },
  {
    name: "CAES ImePAC",
    handle: "@caes.imepac",
    url: "https://instagram.com/caes.imepac"
  },
  {
    name: "COEPS Araguari",
    handle: "@coeps.araguari",
    url: "https://instagram.com/coeps.araguari"
  }
];

export default function ContatoPage() {
  return (
    <main
      className="relative min-h-screen w-full overflow-hidden pb-40" // pb-40 para espaçamento na parte inferior
      style={{
        ...poppins.style,
        backgroundColor: "#ffffff",
      }}
    >
      {/* Conteúdo Principal */}
      <div className="relative flex flex-col items-center justify-center p-8">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-[#09427d] uppercase mb-4">Contato</h1>
          <p className="text-lg text-[#09427d]">
            Siga-nos no Instagram para ficar por dentro das novidades
          </p>
        </header>
        <section className="w-full max-w-4xl grid gap-8 sm:grid-cols-2 md:grid-cols-3">
          {instagramAccounts.map((account) => (
            <Link
              key={account.handle}
              href={account.url}
              target="_blank"
              className="instagram-hover flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-md transition-transform duration-300 hover:scale-105 cursor-pointer"
            >
              <div className="mb-4">
                <FaInstagram className="w-12 h-12 text-[#09427d]" />
              </div>
              <div className="text-center">
                <h2 className="text-xl font-bold text-[#09427d] uppercase">
                  {account.name}
                </h2>
                <p className="text-lg text-gray-600">{account.handle}</p>
              </div>
            </Link>
          ))}
        </section>
      </div>

      {/* Container com o Email centralizado */}
      <section className="mt-12 w-full max-w-4xl mx-auto">
        <div className="p-6 bg-white rounded-xl shadow-md text-center transition-transform duration-300 hover:scale-105 mx-auto">
          <h2 className="text-2xl font-bold text-[#09427d] uppercase mb-2">Email</h2>
          <a
            href="mailto:dadg.imepac@gmail.com"
            className="text-lg text-gray-600 hover:text-[#09427d] transition-colors duration-300"
          >
            dadg.imepac@gmail.com
          </a>
        </div>
      </section>

      {/* Fundo com Onda SVG na parte inferior */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          overflow: 'hidden',
          lineHeight: 0,
        }}
      >
        <svg
          viewBox="0 0 500 150"
          preserveAspectRatio="none"
          style={{
            display: 'block',
            width: '100%',
            height: '150px',
            opacity: 0.6,
          }}
        >
          <path
            d="M0.00,49.98 C150.00,150.00 349.12,-50.00 500.00,49.98 L500.00,150.00 L0.00,150.00 Z"
            style={{ fill: '#09427d' }}
          />
        </svg>
      </div>
    </main>
  );
}
