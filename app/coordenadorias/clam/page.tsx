'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import './style.css';
import { IAcademicLeague } from '@/app/lib/models/AcademicLeagues';
import Link from 'next/link';

export default function CLAMPage() {
    const [activeSection, setActiveSection] = useState<"basic" | "clinic" | null>(null);
    const [data, setData] = useState<Pick<IAcademicLeague, "_id" | "name" | "acronym" | "type">[]>([]);

    useEffect(() => {
        // Criar partículas
        const particlesContainer = document.querySelector('.particles');
        if (particlesContainer) {
            for (let i = 0; i < 65; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = `${Math.random() * 100}%`;
                particle.style.top = `${Math.random() * 100}%`;
                particle.style.animationDelay = `${Math.random() * 8}s`;
                particlesContainer.appendChild(particle);
            }
        }
    }, []);

    useEffect(() => {
        // Criar partículas
        const fetchData = async () => {
            const data = await fetch('/api/get/getAllNamesAndAcronym');
            if (!data.ok) {
                alert('Network response was not ok')
                throw new Error('Network response was not ok');
            }
            const json = await data.json();
            setData(json.data);
        }
        fetchData();
    }, []);

    const toggleSection = (section: "basic" | "clinic") => {
        setActiveSection(activeSection === section ? null : section);
    };

    return (
        <div className="clam-container">
            <div className="clam-background"></div>
            <div className="particles"></div>
            <div className="clam-content">
                {/* Seção do Logo e Título */}
                <div className="logo-container">
                    <div className="logo-circle">
                        <Image
                            src="/CLAM.png"
                            alt="Logo CLAM"
                            width={180}
                            height={180}
                            className="logo-image"
                        />
                    </div>

                    <div className="title-container">
                        <h1 className="title-glow">CLAM</h1>
                        <h2 className="text-3xl text-white/90 font-medium tracking-wide">
                            Coordenadoria de Ligas Acadêmicas de Medicina
                        </h2>
                    </div>
                </div>

                {/* Informações */}
                <div className="info-container">
                    <h2>Quem Somos</h2>
                    <p>
                        A CLAM (Coordenadoria de Ligas Acadêmicas de Medicina) é o órgão responsável por coordenar e integrar todas as ligas acadêmicas da Imepac.
                    </p>
                </div>

                <div className="info-container">
                    <h2>Nossos Objetivos</h2>
                    <p>
                        Promover a integração entre as ligas acadêmicas, fomentar o desenvolvimento acadêmico e científico, e contribuir para a formação médica de excelência.
                    </p>
                </div>

                <div className="collapsible">
                    <div
                        className="collapsible-header"
                        onClick={() => toggleSection('basic')}
                    >
                        <span>Ciclo Básico</span>
                        <span className={`arrow ${activeSection === 'basic' ? 'active' : ''}`}>▼</span>
                    </div>
                    <div className={`collapsible-content ${activeSection === 'basic' ? 'active' : ''}`}>
                        <ul className="liga-list">
                            {data.filter((value) => value.type === "basic").map((league, index) => (
                                <li key={index} className="liga-item">
                                    <Link href={`/coordenadorias/clam/liga/${league._id}`}>
                                        {league.name} - ({league.acronym})
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="collapsible">
                    <div
                        className="collapsible-header"
                        onClick={() => toggleSection('clinic')}
                    >
                        <span>Ciclo Clínico</span>
                        <span className={`arrow ${activeSection === 'clinic' ? 'active' : ''}`}>▼</span>
                    </div>
                    <div className={`collapsible-content ${activeSection === 'clinic' ? 'active' : ''}`}>
                        <ul className="liga-list">
                            {data.filter((value) => value.type === "clinic").map((league, index) => (
                                <li key={index} className="liga-item">
                                    <Link href={`/coordenadorias/clam/liga/${league._id}`}>
                                        {league.name} - ({league.acronym})
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                {/*

                <div className="collapsible">
                    <div 
                        className="collapsible-header"
                        onClick={() => toggleSection('basico')}
                    >
                        <span>Ciclo Básico</span>
                        <span className={`arrow ${activeSection === 'basico' ? 'active' : ''}`}>▼</span>
                    </div>
                    <div className={`collapsible-content ${activeSection === 'basico' ? 'active' : ''}`}>
                        <ul className="liga-list">
                            {ligasBasico.map((liga, index) => (
                                <li key={index} className="liga-item">{liga}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="collapsible">
                    <div 
                        className="collapsible-header"
                        onClick={() => toggleSection('clinico')}
                    >
                        <span>Ciclo Clínico</span>
                        <span className={`arrow ${activeSection === 'clinico' ? 'active' : ''}`}>▼</span>
                    </div>
                    <div className={`collapsible-content ${activeSection === 'clinico' ? 'active' : ''}`}>
                        <ul className="liga-list">
                            {ligasClinico.map((liga, index) => (
                                <li key={index} className="liga-item">{liga}</li>
                            ))}
                        </ul>
                    </div>
                </div>
                */}

            </div>
        </div>
    );
}
