import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/mongodb';
import CertificateModel from '@/app/lib/models/CertificateModel';
import EventCertificateModel from '@/app/lib/models/EventCertificateModel';
import AcademicLeagueModel from '@/app/lib/models/AcademicLeagues';
import { unstable_cache } from 'next/cache';

export const revalidate = 300;

const getHomeStats = unstable_cache(
    async () => {
        await connectToDatabase();

        const [
            alunosRepresentados,
            eventosRealizados,
            coordenadoriasAtivas,
            certificadosEmitidos
        ] = await Promise.all([
            CertificateModel.distinct('ownerCpf').then(cpfs => cpfs.length),
            EventCertificateModel.countDocuments(),
            AcademicLeagueModel.countDocuments(),
            CertificateModel.countDocuments()
        ]);

        return {
            alunosRepresentados,
            eventosRealizados,
            coordenadoriasAtivas,
            certificadosEmitidos
        };
    },
    ['home-stats'],
    { revalidate: 300 },
);

export async function GET() {
    try {
        return NextResponse.json(await getHomeStats());
    } catch (error) {
        console.error('Error fetching home stats:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
