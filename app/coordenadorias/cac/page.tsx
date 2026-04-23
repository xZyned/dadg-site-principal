"use client"
import React from 'react';
import Image from 'next/image';
import './style.css';

const CacPage = () => {
  const teamMembers = [
    { name: 'Mateus Rosa', role: 'Coordenador', photo: '/membersCAC/mateus.jpg' },
    { name: 'Nicoly Gonzaga', role: 'Coordenadora', photo: '/membersCAC/nicoly.jpeg' },
    { name: 'Gianluca Zambiazi', role: 'Núcleo de Apoio', photo: '/membersCAC/gianluca.jpeg' },
    { name: 'Rafaela Luiza Gonzaga', role: 'Núcleo de Apoio', photo: '/membersCAC/rafaela.png' },
    { name: 'Lucas Borges', role: 'Núcleo de Apoio', photo: '/membersCAC/lucas.jpg' },
    { name: 'Heloísa Benatt', role: 'Núcleo de Apoio', photo: '/membersCAC/helo.jpeg' }
  ];

  return (
    <div className="cac-page">
      <div className="main-container">
        <div className="logo-section slide-in-left">
          <Image src="/coordinators/CAC.jpeg" alt="Logo CAC" width={200} height={200} className="cac-logo" />
        </div>

        <div className="header-content fade-and-rise">
          <h1 className="cac-logo-title deepshadow">CAC</h1>
          <h2 className="subtitle">
            Coordenadoria Acadêmica de Certificados e TI.
          </h2>
          <p className="description description-animate">
            O CAC atua trazendo inovação, tecnologia e organização para os processos de Certificados do DADG.
          </p>
        </div>
      </div>

      <div className="cards-container fade-in">
        <div className="info-card modern-card">
          <h2>Visão</h2>
          <p>Ser a ponte entre setores, pessoas e ideias com empatia e excelência.</p>
        </div>
        <div className="info-card modern-card delay-1">
          <h2>Missão</h2>
          <p>Garantir inovação e organização para os processos necessários para os certificados dos eventos realizados, e melhorar o site cada vez mais para trazer uma melhor experiência para os discentes.</p>
        </div>
        <div className="info-card modern-card delay-2">
          <h2>Valores</h2>
          <p>Empatia, Transparência, Agilidade, Organização e Colaboração.</p>
        </div>
      </div>
      <div className="credit-section fade-in">
        <p className="credit-text">
          Nossa coordenadora valoriza cada conquista como um reconhecimento oficial.
        </p>
        <h2 className="credit-title">Equipe CAC 2025</h2>
        <div className="team-container">
          {teamMembers.map((member, index) => (
            <div key={index} className="team-member">
              <div className="photo-frame">
                <Image
                  src={member.photo}
                  alt={member.name}
                  width={150}
                  height={150}
                  className="member-photo"
                />
              </div>
              <div className="member-info">
                <h3 className="member-name">{member.name}</h3>
                <p className="member-role">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CacPage;
