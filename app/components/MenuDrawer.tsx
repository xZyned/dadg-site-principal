'use client';
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  HeartHandshake,
  Users,
  Plane,
  BadgeCheck,
  Home,
  FileText,
  LayoutGrid,
  Calendar,
  Mail,
  HelpCircle,
  MessageCircle,
  Bell,
  Menu,
  ChevronDown,
  Sun,
  Moon,
  User,
  X,
  LogOut
} from "lucide-react";
import { useTheme } from "next-themes";
import { useUserContext } from "@/lib/userProvider";

export default function MenuDrawer({ blogEnabled = true }: { blogEnabled?: boolean }) {
  const [menuAberto, setMenuAberto] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [coordenadoriasSubmenuOpen, setCoordenadoriasSubmenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [windowWidth, setWindowWidth] = useState<number>(1024);
  const [hasNotification, setHasNotification] = useState(true);
  const pathname = usePathname() || '/';
  const { theme, setTheme } = useTheme();
  const { tokenVar } = useUserContext();
  const isLogged = !!tokenVar;

  const headerBackgroundColor =
    pathname.startsWith("/coordenadorias/clam")
      ? "#0A7A1A"
      : pathname.startsWith("/coordenadorias/caes")
        ? "#056653"
        : pathname.startsWith("/coordenadorias/caep")
          ? "#000066"
          : pathname.startsWith("/coordenadorias/cac")
            ? "#050a4a"
            : pathname.startsWith("/coordenadorias/clev")
              ? "#526c94"
              : "#002B5B";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevenir rolagem do fundo quando o menu estiver aberto
  useEffect(() => {
    if (menuAberto) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuAberto]);

  const toggleCoordenadoriasSubmenu = () => setCoordenadoriasSubmenuOpen((prev) => !prev);

  const coordenadoriasSubmenuItems = [
    { label: "CAEP", href: "/coordenadorias/caep", icon: <BookOpen /> },
    { label: "CAES", href: "/coordenadorias/caes", icon: <HeartHandshake /> },
    { label: "CLAM", href: "/coordenadorias/clam", icon: <Users /> },
    { label: "CLEV", href: "/coordenadorias/clev", icon: <Plane /> },
    { label: "CAC", href: "/coordenadorias/cac", icon: <BadgeCheck /> }
  ];

  const isMobile = mounted ? windowWidth < 768 : false;
  const headerHeight = isMobile ? "35px" : "45px";
  const headerFontSize = isMobile ? "12px" : "16px";
  const headerGap = isMobile ? "8px" : "16px";

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.style.setProperty("--dadg-header-height", headerHeight);
  }, [headerHeight, mounted]);

  // Componente de Link Customizado para o Menu
  const NavItem = ({ href, icon: Icon, label, badge }: any) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        onClick={() => setMenuAberto(false)}
        className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all font-medium ${
          isActive
            ? "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200"
        }`}
      >
        <div className="flex items-center gap-3">
          <Icon size={20} className={isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500"} />
          <span>{label}</span>
        </div>
        {badge && (
          <span className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 text-xs font-bold px-2 py-0.5 rounded-full">
            {badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <>
      {/* Top Navbar Header (Fixed as before) */}
      <div className="fixed top-0 left-0 w-full z-[1000]" style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.25))" }}>
        <header
          style={{
            position: "relative",
            width: "100%",
            height: headerHeight,
            backgroundColor: headerBackgroundColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 15px",
            color: "white",
            fontWeight: "bold",
            fontSize: headerFontSize,
            transition: "height 0.3s ease, font-size 0.3s ease, background-color 0.3s ease",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <button
              onClick={() => setMenuAberto(true)}
              className="text-white hover:text-blue-200 transition-colors relative flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/10"
            >
              <Menu size={isMobile ? 24 : 26} strokeWidth={2} />
            </button>
          </div>

          <div
            className="absolute left-1/2 -translate-x-1/2 w-[220px] h-[55px] md:w-[280px] md:h-[65px] z-[99]"
            style={{
              top: "calc(100% - 1px)",
              color: headerBackgroundColor,
              transition: "color 0.3s ease"
            }}
          >
            <svg viewBox="0 0 240 60" preserveAspectRatio="none" className="w-full h-full">
              <path d="M 0 0 C 60 0 60 60 120 60 C 180 60 180 0 240 0 Z" fill="currentColor" />
            </svg>
          </div>

          <Link href="/" className="absolute left-1/2 -translate-x-1/2 top-[2px] md:top-[6px] w-[75px] h-[75px] md:w-[90px] md:h-[90px] z-[100] cursor-pointer hover:scale-105 transition-transform">
            <div className="relative w-full h-full">
              <Image src="/dadg_sem_fundo.png" alt="Logo DADG" fill className="object-contain drop-shadow-sm" priority />
            </div>
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: headerGap }}>
            <div className="hidden md:flex" style={{ justifyContent: "flex-end", alignItems: "center", gap: headerGap, textTransform: "uppercase" }}>
              <Link href="/" style={{ color: "white", textDecoration: "none", fontSize: headerFontSize, transition: "color 0.2s hover:text-blue-200" }}>Início</Link>
              {blogEnabled && (
                <Link href="/blog" style={{ color: "white", textDecoration: "none", fontSize: headerFontSize, transition: "color 0.2s hover:text-blue-200" }}>Blog</Link>
              )}
              <Link href="/eventos" style={{ color: "white", textDecoration: "none", fontSize: headerFontSize, transition: "color 0.2s hover:text-blue-200" }}>Eventos</Link>
              <Link href="/certificados" style={{ color: "white", textDecoration: "none", fontSize: headerFontSize, transition: "color 0.2s hover:text-blue-200" }}>Certificados</Link>
            </div>

            <button
              onClick={() => {
                window.dispatchEvent(new Event('open-schedule-popup'));
                setHasNotification(false);
              }}
              className="text-white hover:text-blue-200 transition-colors relative flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/10"
            >
              <Bell size={isMobile ? 18 : 20} />
              {hasNotification && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-400 rounded-full shadow-[0_0_0_2px_rgba(0,43,91,1)]" style={{ boxShadow: `0 0 0 2px ${headerBackgroundColor}` }}></span>
              )}
            </button>

            {/* Profile Dropdown Container */}
            <div className="relative flex items-center h-full">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="text-white hover:text-blue-200 transition-colors relative flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/10"
                aria-label="Opções do Perfil"
              >
                <User size={isMobile ? 18 : 20} />
              </button>


            </div>
          </div>
        </header>
      </div>

      {/* Overlay Escuro quando o menu está aberto */}
      {menuAberto && (
        <div 
          className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm z-[1050] transition-opacity"
          onClick={() => setMenuAberto(false)}
        />
      )}

      {/* Drawer Menu Sidebar */}
      <div
        className={`fixed top-0 left-0 h-[100dvh] w-[280px] max-w-[85vw] bg-white dark:bg-slate-950 shadow-2xl z-[1100] transform transition-transform duration-300 ease-in-out flex flex-col ${menuAberto ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Cabeçalho do Sidebar (Branding) */}
        <div 
          className="flex items-center justify-center relative pt-4 pb-6 px-6 transition-colors duration-300"
          style={{ backgroundColor: headerBackgroundColor }}
        >
          <div className="w-24 h-24 relative flex-shrink-0 drop-shadow-md hover:scale-105 transition-transform duration-300 cursor-pointer z-10" onClick={() => setMenuAberto(false)}>
            <Link href="/">
              <Image 
                src="/dadg_sem_fundo.png" 
                alt="Logo DADG" 
                fill 
                className="object-contain" 
                priority
              />
            </Link>
          </div>
          <button 
            onClick={() => setMenuAberto(false)}
            className="absolute top-2 right-2 p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0 z-10"
          >
            <X size={24} />
          </button>

          {/* Onda Decorativa (Divider) */}
          <div className="absolute -bottom-[1px] left-0 w-full overflow-hidden leading-[0] z-0 pointer-events-none">
            <svg viewBox="0 0 1440 100" className="w-full h-[24px] block" preserveAspectRatio="none">
              <path 
                d="M0,100 L0,0 C480,100 960,100 1440,0 L1440,100 Z" 
                className="fill-white dark:fill-slate-950" 
              />
            </svg>
          </div>
        </div>

        {/* Links de Navegação */}
        <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1">
          <NavItem href="/" icon={Home} label="Início" />
          <NavItem href="/certificados" icon={FileText} label="Certificados" />
          <NavItem href="/mural" icon={LayoutGrid} label="Mural" />
          <NavItem href="/eventos" icon={Calendar} label="Eventos" badge={hasNotification ? "1" : null} />
          {blogEnabled && <NavItem href="/blog" icon={BookOpen} label="Blog" />}
          
          {/* Submenu de Coordenadorias */}
          <div className="mt-1">
            <button 
              onClick={toggleCoordenadoriasSubmenu}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-medium ${coordenadoriasSubmenuOpen ? "bg-slate-50 text-slate-900 dark:bg-slate-800/50 dark:text-slate-200" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200"}`}
            >
              <div className="flex items-center gap-3">
                <Users size={20} className={coordenadoriasSubmenuOpen ? "text-slate-600 dark:text-slate-400" : "text-slate-400 dark:text-slate-500"} />
                <span>Coordenadorias</span>
              </div>
              <ChevronDown size={18} className={`text-slate-400 transition-transform duration-300 ${coordenadoriasSubmenuOpen ? "rotate-180" : ""}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${coordenadoriasSubmenuOpen ? "max-h-[300px] opacity-100 mt-1" : "max-h-0 opacity-0"}`}>
              <div className="flex flex-col gap-1 pl-4 border-l-2 border-slate-100 dark:border-slate-800 ml-6 py-2">
                {coordenadoriasSubmenuItems.map(item => (
                  <Link 
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuAberto(false)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm font-medium ${
                      pathname === item.href
                        ? "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-500/10"
                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    {React.cloneElement(item.icon as React.ReactElement, { size: 18, className: pathname === item.href ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500" })}
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-100 dark:bg-slate-800 my-2 mx-2"></div>
          
          <NavItem href="/ouvidoria" icon={MessageCircle} label="Ouvidoria" />
          <NavItem href="/contato" icon={Mail} label="Contato" />
          <NavItem href="/sobre" icon={HelpCircle} label="Sobre Nós" />
        </div>

        {/* Rodapé do Menu (User Info & Logout) */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          {isLogged ? (
            <>
              <Link 
                href="/perfil"
                onClick={() => setMenuAberto(false)}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 flex items-center justify-between shadow-sm mb-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600 transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center group-hover:scale-105 transition-transform">
                    AD
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Aluno DADG</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[120px]">Membro Oficial</span>
                  </div>
                </div>
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-slate-800 flex-shrink-0 group-hover:shadow-[0_0_8px_rgba(34,197,94,0.4)] transition-shadow"></div>
              </Link>
            </>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="text-xs text-slate-500 dark:text-slate-400 text-center px-2">
                Faça login para acessar certificados, histórico e painéis restritos.
              </div>
              <a 
                href="/api/auth/login" 
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-all shadow-md shadow-blue-600/20"
              >
                Fazer Login
              </a>
            </div>
          )}
        </div>
      </div>
      {/* Menu de Perfil (Renderizado fora do header para não sofrer interferência do filter: drop-shadow e permitir overlay na tela toda) */}
      {profileDropdownOpen && (
        <>
          <div 
            className="fixed inset-0 z-[1010]" 
            onClick={() => setProfileDropdownOpen(false)}
          ></div>
          <div 
            className="fixed w-64 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[24px] shadow-[0_20px_60px_rgba(7,48,89,0.18)] z-[1020] overflow-hidden flex flex-col p-2 animate-in fade-in slide-in-from-top-2 duration-200"
            style={{ top: isMobile ? "47px" : "57px", right: "15px" }}
          >
            {isLogged ? (
              <>
                <div className="p-3 mb-1 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center flex-shrink-0">
                      AD
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-slate-900 dark:text-white truncate">Aluno DADG</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 truncate">Membro Oficial</span>
                    </div>
                  </div>
                </div>
                
                <Link 
                  href="/perfil"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/50 transition-colors"
                >
                  <User size={16} /> Meu Perfil
                </Link>
              </>
            ) : (
              <div className="p-3 mb-1 border-b border-slate-100 dark:border-slate-800 flex flex-col gap-2">
                <span className="text-sm font-semibold text-slate-900 dark:text-white px-1">Visitante</span>
                <a 
                  href="/api/auth/login"
                  className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-2 text-sm font-bold transition-colors"
                >
                  Fazer Login
                </a>
              </div>
            )}

            <button 
              onClick={() => {
                setTheme(theme === 'dark' ? 'light' : 'dark');
              }}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/50 transition-colors w-full text-left"
            >
              <div className="flex items-center gap-3">
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                Tema {theme === 'dark' ? 'Claro' : 'Escuro'}
              </div>
            </button>

            {isLogged && (
              <>
                <div className="h-px bg-slate-100 dark:bg-slate-800 my-1 mx-2"></div>
                <a 
                  href="/api/auth/logout"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20 transition-colors"
                >
                  <LogOut size={16} /> Sair
                </a>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
}
