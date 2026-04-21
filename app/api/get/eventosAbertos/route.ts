import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import EventCertificateModel from "@/app/lib/models/EventCertificateModel";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        await connectToDatabase();

        const eventos = await EventCertificateModel.find(
            { isOpen: true },
            {
                _id: 1,
                eventName: 1,
                eventDescription: 1,
                eventType: 1,
                isPaid: 1,
                price: 1,
                maxParticipants: 1,
                registrationCount: 1,
                createdAt: 1,
                updatedAt: 1,
            }
        )
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({ data: eventos }, { status: 200 });
    } catch (error) {
        console.error("Erro ao buscar eventos abertos:", error);
        return NextResponse.json(
            { error: "Erro interno ao buscar eventos" },
            { status: 500 }
        );
    }
}
