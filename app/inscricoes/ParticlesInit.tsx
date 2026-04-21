'use client';

import { useEffect } from 'react';

export default function ParticlesInit() {
    useEffect(() => {
        const container = document.querySelector('.particles');
        if (!container) return;
        for (let i = 0; i < 40; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            p.style.left = `${Math.random() * 100}%`;
            p.style.top = `${Math.random() * 100}%`;
            p.style.animationDelay = `${Math.random() * 8}s`;
            container.appendChild(p);
        }
    }, []);
    return null;
}
