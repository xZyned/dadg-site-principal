import Image from "next/image";
import Link from "next/link";
import { MapPin, Instagram, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative z-10 w-full bg-[#001f45] text-white mt-auto">
      {/* Main footer content */}
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Col 1 — Brand */}
        <div className="flex flex-col items-start lg:col-span-1">
          <div className="mb-5">
            <Image src="/dadg_sem_fundo.png" alt="Logo DADG" width={96} height={96} className="opacity-90 object-contain" />
          </div>
          <h3 className="text-lg font-bold font-serif mb-2 leading-snug">
            Diretório Acadêmico<br />Diogo Guimarães
          </h3>
          <p className="text-blue-200/60 text-sm leading-relaxed mt-2 max-w-xs">
            Representância oficial dos estudantes de Medicina da IMEPAC Araguari, com compromisso com a excelência e o bem-estar discente.
          </p>
          <div className="flex items-start mt-6 text-blue-300/70 text-sm">
            <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
            <span>Av. Minas Gerais, 1889 — Araguari, MG</span>
          </div>
        </div>

        {/* Col 2 — Navegação */}
        <div className="flex flex-col">
          <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-blue-300/70 mb-5">Navegação</h4>
          <nav aria-label="Links de navegação" className="flex flex-col gap-3">
            {[
              { href: "/", label: "Início" },
              { href: "/coordenadorias", label: "Coordenadorias" },
              { href: "/eventos", label: "Eventos" },
              { href: "/certificados", label: "Certificados" },
              { href: "/sobre", label: "Sobre o DADG" },
              { href: "/ouvidoria", label: "Ouvidoria" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-blue-100/70 hover:text-white text-sm transition-colors w-fit"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Col 3 — Coordenadorias */}
        <div className="flex flex-col">
          <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-blue-300/70 mb-5">Coordenadorias</h4>
          <nav aria-label="Links das coordenadorias" className="flex flex-col gap-3">
            {[
              { href: "/coordenadorias/caep", label: "CAEP" },
              { href: "/coordenadorias/caes", label: "CAES" },
              { href: "/coordenadorias/clam", label: "CLAM" },
              { href: "/coordenadorias/cac", label: "CAC" },
              { href: "/coordenadorias/clev", label: "CLEV" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-blue-100/70 hover:text-white text-sm transition-colors w-fit"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Col 4 — Contato & Redes */}
        <div className="flex flex-col">
          <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-blue-300/70 mb-5">Contato & Redes</h4>
          <div className="flex gap-3 mb-6">
            <a
              href="https://instagram.com/dadg.imepac"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram do DADG"
              className="w-11 h-11 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center transition-colors"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="mailto:contato@dadgimepac.com.br"
              aria-label="E-mail do DADG"
              className="w-11 h-11 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center transition-colors"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
          <p className="text-blue-200/60 text-sm leading-relaxed">
            Dúvidas, sugestões ou demandas?
          </p>
          <Link
            href="/ouvidoria"
            className="mt-4 inline-flex items-center text-sm font-medium text-white bg-white/10 hover:bg-white/20 border border-white/15 px-5 py-2.5 rounded-xl transition-colors w-fit"
          >
            Fale com a Ouvidoria
          </Link>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-blue-200/40 text-xs text-center sm:text-left">
            &copy; {new Date().getFullYear()} DADG — Diretório Acadêmico Diogo Guimarães · IMEPAC Araguari
          </p>
          <p className="text-blue-200/30 text-xs">
            Todos os direitos reservados
          </p>
        </div>
      </div>
    </footer>
  );
}
