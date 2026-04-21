import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import EventRegistrationModel from "@/app/lib/models/EventRegistrationModel";
import { auth0 } from "@/app/src/lib/auth0/Auth0Client";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        // Verificar autenticação
        const session = await auth0.getSession();
        if (!session?.user) {
            return NextResponse.json(
                { error: "Você precisa estar autenticado para ver suas inscrições." },
                { status: 401 }
            );
        }

        await connectToDatabase();

        const inscricoes = await EventRegistrationModel.find(
            {
                userId: session.user.sub,
                status: { $ne: 'cancelled' },
            },
            {
                _id: 1,
                eventId: 1,
                status: 1,
                isPaid: 1,
                registeredAt: 1,
                paymentInfo: 1,
            }
        )
            .populate('eventId', 'eventName eventDescription eventType isPaid price maxParticipants')
            .sort({ registeredAt: -1 })
            .lean();

        return NextResponse.json({ data: inscricoes }, { status: 200 });
    } catch (error) {
        console.error("Erro ao buscar inscrições:", error);
        return NextResponse.json(
            { error: "Erro interno ao buscar suas inscrições." },
            { status: 500 }
        );
    }
}
