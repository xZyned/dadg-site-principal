'use client';

import React from 'react';
import Link from 'next/link';
import { ClipboardList, ArrowRight } from 'lucide-react';

export default function InscricaoBanner() {
    return (
        <div style={{
            background: 'linear-gradient(135deg, #09427d 0%, #1a5ca8 100%)',
            borderRadius: '14px',
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap',
            marginBottom: '24px',
            boxShadow: '0 4px 20px rgba(9,66,125,0.25)',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                    background: 'rgba(255,255,255,0.2)',
                    borderRadius: '12px',
                    padding: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <ClipboardList size={24} color="#fff" />
                </div>
                <div>
                    <h3 style={{ color: '#fff', fontSize: '16px', fontWeight: 700, margin: 0 }}>
                        Inscrições Abertas
                    </h3>
                    <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px', margin: '3px 0 0' }}>
                        Confira os eventos disponíveis para inscrição
                    </p>
                </div>
            </div>

            <Link
                href="/inscricoes"
                style={{
                    background: '#fff',
                    color: '#09427d',
                    textDecoration: 'none',
                    borderRadius: '10px',
                    padding: '10px 18px',
                    fontSize: '14px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    whiteSpace: 'nowrap',
                    transition: 'opacity 0.2s',
                }}
            >
                Ver Inscrições <ArrowRight size={15} />
            </Link>
        </div>
    );
}
