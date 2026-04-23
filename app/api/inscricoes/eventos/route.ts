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
                { error: "Você precisa estar autenticado para se inscrever." },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { eventId, selectedModalityCode, userCpf, userPhone, notes } = body;

        if (!eventId) {
            return NextResponse.json(
                { error: "ID do evento é obrigatório." },
                { status: 400 }
            );
        }

        if (!selectedModalityCode) {
            return NextResponse.json(
                { error: "Modalidade é obrigatória." },
                { status: 400 }
            );
        }

        if (!mongoose.Types.ObjectId.isValid(eventId)) {
            return NextResponse.json(
                { error: "ID do evento inválido." },
                { status: 400 }
            );
        }

        await connectToDatabase();

        // Buscar o evento
        const evento = await EventCertificateModel.findOne({
            _id: new mongoose.Types.ObjectId(eventId),
            isOpen: true,
        }).lean();

        if (!evento) {
            return NextResponse.json(
                { error: "Evento não encontrado ou não está aberto para inscrições." },
                { status: 404 }
            );
        }

        // Verificar se a modalidade existe
        const selectedModality = (evento as any).modalities?.find(
            (m: any) => m.code === selectedModalityCode
        );

        if (!selectedModality) {
            return NextResponse.json(
                { error: "Modalidade selecionada não é válida para este evento." },
                { status: 400 }
            );
        }

        // Verificar se já existe inscrição
        const inscricaoExistente = await EventRegistrationModel.findOne({
            eventId: new mongoose.Types.ObjectId(eventId),
            userId: session.user.sub,
        });

        if (inscricaoExistente) {
            if (inscricaoExistente.status === 'cancelled') {
                // Reativar inscrição cancelada
                inscricaoExistente.status = 'confirmed';
                inscricaoExistente.cancelledAt = undefined;
                inscricaoExistente.userCpf = userCpf || inscricaoExistente.userCpf;
                inscricaoExistente.userPhone = userPhone || inscricaoExistente.userPhone;
                inscricaoExistente.notes = notes || inscricaoExistente.notes;
                inscricaoExistente.registeredAt = new Date();
                inscricaoExistente.selectedModality = {
                    code: selectedModality.code,
                    name: selectedModality.name,
                };
                inscricaoExistente.submissionDeadline = (evento as any).submission_deadline;
                await inscricaoExistente.save();

                return NextResponse.json(
                    { message: "Inscrição reativada com sucesso!", data: inscricaoExistente },
                    { status: 200 }
                );
            }

            return NextResponse.json(
                { error: "Você já está inscrito neste evento." },
                { status: 409 }
            );
        }

        // Verificar limite de vagas
        const maxParticipants = (evento as any).maxParticipants ?? 999;
        const registrationCount = (evento as any).registrationCount ?? 0;

        let status: 'confirmed' | 'waitlist' = 'confirmed';
        if (registrationCount >= maxParticipants) {
            status = 'waitlist';
        }

        // Criar inscrição
        const novaInscricao = await EventRegistrationModel.create({
            eventId: new mongoose.Types.ObjectId(eventId),
            userId: session.user.sub,
            userName: session.user.name || session.user.email || 'Usuário',
            userEmail: session.user.email || '',
            userCpf: userCpf || undefined,
            userPhone: userPhone || undefined,
            selectedModality: {
                code: selectedModality.code,
                name: selectedModality.name,
            },
            submissionDeadline: (evento as any).submission_deadline,
            status,
            isPaid: false,
            registeredAt: new Date(),
            notes: notes || undefined,
        });

        // Incrementar contador de inscrições no evento
        await EventCertificateModel.updateOne(
            { _id: new mongoose.Types.ObjectId(eventId) },
            { $inc: { registrationCount: 1 } }
        );

        const mensagem =
            status === 'waitlist'
                ? "Você foi adicionado à lista de espera do evento."
                : "Inscrição realizada com sucesso!";

        return NextResponse.json(
            { message: mensagem, data: novaInscricao, status },
            { status: 201 }
        );
    } catch (error: any) {
        // Erro de chave duplicada (inscrição duplicada)
        if (error.code === 11000) {
            return NextResponse.json(
                { error: "Você já está inscrito neste evento." },
                { status: 409 }
            );
        }
        console.error("Erro ao realizar inscrição:", error);
        return NextResponse.json(
            { error: "Erro interno ao processar inscrição." },
            { status: 500 }
        );
    }
}
