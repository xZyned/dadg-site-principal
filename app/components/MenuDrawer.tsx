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
  ChevronDown,
  ClipboardList,
  User
} from "lucide-react";

export default function MenuDrawer() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [coordenadoriasSubmenuOpen, setCoordenadoriasSubmenuOpen] = useState(false);
  const [drawerWidth, setDrawerWidth] = useState("250px");
  const [mounted, setMounted] = useState(false);
  const [windowWidth, setWindowWidth] = useState<number>(1024);
  const pathname = usePathname() || '/';

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
                : pathname.startsWith("/inscricoes") || pathname.startsWith("/panel")
                  ? "#073366"
                  : "#09427d";
  const drawerBackgroundColor = headerBackgroundColor;

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth < 768) {
        setDrawerWidth("80%");
      } else {
        setDrawerWidth("250px");
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleCoordenadoriasSubmenu = () => setCoordenadoriasSubmenuOpen((prev) => !prev);

  const coordenadoriasSubmenuItems = [
    {
      label: "CAEP",
      href: "/coordenadorias/caep",
      icon: <BookOpen size={16} />
    },
    {
      label: "CAES",
      href: "/coordenadorias/caes",
      icon: <HeartHandshake size={16} />
    },
    {
      label: "CLAM",
      href: "/coordenadorias/clam",
      icon: <Users size={16} />
    },
    {
      label: "CLEV",
      href: "/coordenadorias/clev",
      icon: <Plane size={16} />
    },
    {
      label: "CAC",
      href: "/coordenadorias/cac",
      icon: <BadgeCheck size={16} />
    }
  ];

  const coordenadoriasSubmenuMaxHeight = coordenadoriasSubmenuOpen
    ? `${coordenadoriasSubmenuItems.length * 40}px`
    : "0px";

  const isMobile = mounted ? windowWidth < 768 : false;
  const isScrolled = mounted ? scrolled : false;
  const headerHeight = isMobile ? (isScrolled ? "30px" : "35px") : (isScrolled ? "35px" : "45px");
  const headerFontSize = isMobile ? (isScrolled ? "11px" : "12px") : (isScrolled ? "14px" : "16px");
  const headerGap = isMobile ? "8px" : "16px";

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.style.setProperty("--dadg-header-height", headerHeight);
  }, [headerHeight, mounted]);

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
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
          transition: "all 0.5s ease-in-out",
          zIndex: 1000,
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      >
        {/* Botão Hamburger */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <button
            onClick={() => setMenuAberto(true)}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            <span style={{ width: "24px", height: "4px", backgroundColor: "white", borderRadius: "4px", display: "block" }}></span>
            <span style={{ width: "24px", height: "4px", backgroundColor: "white", borderRadius: "4px", display: "block" }}></span>
            <span style={{ width: "24px", height: "4px", backgroundColor: "white", borderRadius: "4px", display: "block" }}></span>
          </button>
        </div>

        {/* Links centrais */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: isMobile ? "6px" : headerGap,
            textTransform: "uppercase",
            textAlign: "center",
          }}
        >
          <Link href="/coordenadorias" style={{ color: "white", textDecoration: "none", fontSize: headerFontSize }}>
            Coordenadorias
          </Link>
          <Link href="/" style={{ color: "white", textDecoration: "none", fontSize: headerFontSize }}>
            Início
          </Link>
          <Link href="/inscricoes" style={{ color: "white", textDecoration: "none", fontSize: headerFontSize }}>
            Inscrição de Eventos
          </Link>
          <Link href="/certificados" style={{ color: "white", textDecoration: "none", fontSize: headerFontSize }}>
            Certificados
          </Link>
          {/* SEMPRE SEMPRE SEMRPE SEMPRE SEMPRE DEIXE O PREFETCH DO Link DESATIVADO!!!! */}
          <Link href="/panel/" prefetch={false} style={{ color: "white", textDecoration: "none", fontSize: headerFontSize }}>
            Minha Conta
          </Link>
        </div>

        {/* Ícone à direita */}
        <div style={{ flexShrink: 0 }}>
          <Image
            src="/dadg_sem_fundo.png"
            alt="Logo DADG"
            width={isMobile ? 24 : 30}
            height={isMobile ? 24 : 30}
            className="object-contain"
          />
        </div>

      </header>


      {/* DrawerMenu */}
      <div
        className="drawerContainer"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: drawerWidth,
          height: "100vh",
          backgroundColor: drawerBackgroundColor,
          color: "white",
          padding: isMobile ? "16px" : "20px",
          paddingTop: isMobile ? "60px" : "80px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: isMobile ? "12px" : "15px",
          zIndex: 1100,
          boxShadow: "2px 0 20px rgba(0, 0, 0, 0.3)",
          transform: menuAberto ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s ease, background-color 0.5s ease-in-out",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        <button
          className="menu-close-button"
          onClick={() => setMenuAberto(false)}
          style={{
            cursor: "pointer",
            alignSelf: "flex-end",
            marginRight: isMobile ? "-5px" : "-10px",
            marginTop: isMobile ? "-5px" : "-10px",
            background: "rgba(255, 255, 255, 0.1)",
            border: "none",
            borderRadius: "50%",
            width: isMobile ? "36px" : "40px",
            height: isMobile ? "36px" : "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s ease"
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ transition: "transform 0.3s ease" }}
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="menu-items" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <Link
            href="/"
            style={{
              color: "white",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: isMobile ? "10px" : "12px",
              padding: isMobile ? "10px 14px" : "12px 16px",
              borderRadius: "12px",
              transition: "all 0.3s ease",
              background: pathname === "/" ? "rgba(255, 255, 255, 0.1)" : "transparent",
              fontSize: isMobile ? "14px" : "16px"
            }}
            onClick={() => setMenuAberto(false)}
          >
            <Home size={isMobile ? 20 : 24} />
            Início
          </Link>

          <Link
            href="/certificados"
            style={{
              color: "white",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: isMobile ? "10px" : "12px",
              padding: isMobile ? "10px 14px" : "12px 16px",
              borderRadius: "12px",
              transition: "all 0.3s ease",
              background: pathname === "/certificados" ? "rgba(255, 255, 255, 0.1)" : "transparent",
              fontSize: isMobile ? "14px" : "16px"
            }}
            onClick={() => setMenuAberto(false)}
          >
            <FileText size={isMobile ? 20 : 24} />
            Certificados
          </Link>

          <Link
            href="/mural"
            style={{
              color: "white",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: isMobile ? "10px" : "12px",
              padding: isMobile ? "10px 14px" : "12px 16px",
              borderRadius: "12px",
              transition: "all 0.3s ease",
              background: pathname === "/mural" ? "rgba(255, 255, 255, 0.1)" : "transparent",
              fontSize: isMobile ? "14px" : "16px"
            }}
            onClick={() => setMenuAberto(false)}
          >
            <LayoutGrid size={isMobile ? 20 : 24} />
            Mural
          </Link>

          <Link
            href="/eventos"
            style={{
              color: "white",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: isMobile ? "10px" : "12px",
              padding: isMobile ? "10px 14px" : "12px 16px",
              borderRadius: "12px",
              transition: "all 0.3s ease",
              background: pathname === "/eventos" ? "rgba(255, 255, 255, 0.1)" : "transparent",
              fontSize: isMobile ? "14px" : "16px"
            }}
            onClick={() => setMenuAberto(false)}
          >
            <Calendar size={isMobile ? 20 : 24} />
            Calendário
          </Link>

          <Link
            href="/inscricoes"
            style={{
              color: "white",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: isMobile ? "10px" : "12px",
              padding: isMobile ? "10px 14px" : "12px 16px",
              borderRadius: "12px",
              transition: "all 0.3s ease",
              background: pathname.startsWith("/inscricoes") ? "rgba(255, 255, 255, 0.1)" : "transparent",
              fontSize: isMobile ? "14px" : "16px"
            }}
            onClick={() => setMenuAberto(false)}
          >
            <ClipboardList size={isMobile ? 20 : 24} />
            Inscrição de Eventos
          </Link>

          <Link 
            href="/ouvidoria" 
            style={{ 
              color: "white", 
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: isMobile ? "10px" : "12px",
              padding: isMobile ? "10px 14px" : "12px 16px",
              borderRadius: "12px",
              transition: "all 0.3s ease",
              background: pathname === "/ouvidoria" ? "rgba(255, 255, 255, 0.1)" : "transparent",
              fontSize: isMobile ? "14px" : "16px"
            }} 
            onClick={() => setMenuAberto(false)}
          >
            <MessageCircle size={isMobile ? 20 : 24} />
            Ouvidoria
          </Link>

          <Link 
            href="/contato" 
            style={{ 
              color: "white", 
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: isMobile ? "10px" : "12px",
              padding: isMobile ? "10px 14px" : "12px 16px",
              borderRadius: "12px",
              transition: "all 0.3s ease",
              background: pathname === "/contato" ? "rgba(255, 255, 255, 0.1)" : "transparent",
              fontSize: isMobile ? "14px" : "16px"
            }}
            onClick={() => setMenuAberto(false)}
          >
            <Mail size={isMobile ? 20 : 24} />
            Contato
          </Link>

          <Link
            href="/sobre"
            style={{
              color: "white",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: isMobile ? "10px" : "12px",
              padding: isMobile ? "10px 14px" : "12px 16px",
              borderRadius: "12px",
              transition: "all 0.3s ease",
              background: pathname === "/sobre" ? "rgba(255, 255, 255, 0.1)" : "transparent",
              fontSize: isMobile ? "14px" : "16px"
            }}
            onClick={() => setMenuAberto(false)}
          >
            <HelpCircle size={isMobile ? 20 : 24} />
            Sobre Nós
          </Link>

          <Link
            href="/panel"
            style={{
              color: "white",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: isMobile ? "10px" : "12px",
              padding: isMobile ? "10px 14px" : "12px 16px",
              borderRadius: "12px",
              transition: "all 0.3s ease",
              background: pathname === "/panel" ? "rgba(255, 255, 255, 0.1)" : "transparent",
              fontSize: isMobile ? "14px" : "16px"
            }}
            onClick={() => setMenuAberto(false)}
          >
            <User size={isMobile ? 20 : 24} />
            Minha Conta
          </Link>
        </div>

        {/* Submenu para Coordenadorias */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: isMobile ? "10px 14px" : "12px 16px",
              borderRadius: "12px",
              cursor: "pointer",
              transition: "all 0.3s ease",
              background: coordenadoriasSubmenuOpen ? "rgba(255, 255, 255, 0.1)" : "transparent",
              fontSize: isMobile ? "14px" : "16px"
            }}
            onClick={toggleCoordenadoriasSubmenu}
          >
            <div style={{ display: "flex", alignItems: "center", gap: isMobile ? "10px" : "12px" }}>
              <Users size={isMobile ? 20 : 24} />
              <span>Coordenadorias</span>
            </div>
            <ChevronDown
              size={isMobile ? 18 : 20}
              style={{
                transform: coordenadoriasSubmenuOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.3s ease"
              }}
            />
          </div>
          <div
            style={{
              marginLeft: "15px",
              overflow: "hidden",
              transition: "max-height 0.3s ease",
              maxHeight: coordenadoriasSubmenuMaxHeight,
            }}
          >
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "5px",
              maxHeight: "200px",
              overflowY: "auto",
              paddingRight: "8px"
            }} className="drawer-submenu-content">
              {coordenadoriasSubmenuItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  style={{
                    color: "white",
                    textDecoration: "none",
                    padding: isMobile ? "8px 14px" : "10px 16px",
                    borderRadius: "8px",
                    transition: "all 0.3s ease",
                    background: pathname === item.href ? "rgba(255, 255, 255, 0.1)" : "transparent",
                    display: "flex",
                    alignItems: "center",
                    gap: isMobile ? "8px" : "8px",
                    minHeight: isMobile ? "36px" : "40px",
                    fontSize: isMobile ? "13px" : "14px"
                  }}
                  onClick={() => setMenuAberto(false)}
                >
                  {React.cloneElement(item.icon, { size: isMobile ? 16 : 16 })}
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
