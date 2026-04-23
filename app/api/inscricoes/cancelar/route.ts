import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import EventRegistrationModel from "@/app/lib/models/EventRegistrationModel";
import EventCertificateModel from "@/app/lib/models/EventCertificateModel";
import { auth0 } from "@/app/src/lib/auth0/Auth0Client";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    try {
        // Verificar autenticação
        const session = await auth0.getSession();
        if (!session?.user) {
            return NextResponse.json(
                { error: "Você precisa estar autenticado para cancelar uma inscrição." },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { inscricaoId } = body;

        if (!inscricaoId) {
            return NextResponse.json(
                { error: "ID da inscrição é obrigatório." },
                { status: 400 }
            );
        }

        if (!mongoose.Types.ObjectId.isValid(inscricaoId)) {
            return NextResponse.json(
                { error: "ID da inscrição inválido." },
                { status: 400 }
            );
        }

        await connectToDatabase();

        // Buscar a inscrição garantindo que pertence ao usuário
        const inscricao = await EventRegistrationModel.findOne({
            _id: new mongoose.Types.ObjectId(inscricaoId),
            userId: session.user.sub,
        });

        if (!inscricao) {
            return NextResponse.json(
                { error: "Inscrição não encontrada." },
                { status: 404 }
            );
        }

        if (inscricao.status === 'cancelled') {
            return NextResponse.json(
                { error: "Esta inscrição já foi cancelada." },
                { status: 409 }
            );
        }

        // Cancelar inscrição
        inscricao.status = 'cancelled';
        inscricao.cancelledAt = new Date();
        await inscricao.save();

        // Decrementar contador de inscrições no evento
        await EventCertificateModel.updateOne(
            { _id: inscricao.eventId },
            { $inc: { registrationCount: -1 } }
        );

        return NextResponse.json(
            { message: "Inscrição cancelada com sucesso." },
            { status: 200 }
        );
    } catch (error) {
        console.error("Erro ao cancelar inscrição:", error);
        return NextResponse.json(
            { error: "Erro interno ao cancelar inscrição." },
            { status: 500 }
        );
    }
}
