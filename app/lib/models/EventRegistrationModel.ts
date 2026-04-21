import mongoose, { Schema, Model } from 'mongoose';
import { ObjectId } from 'mongodb';

export type RegistrationStatus = 'pending' | 'confirmed' | 'cancelled' | 'waitlist';

export interface IEventRegistration {
    _id: ObjectId;
    eventId: ObjectId;
    userId: string;          // Auth0 sub (ex: "auth0|abc123")
    userName: string;
    userEmail: string;
    userCpf?: string;
    userPhone?: string;
    selectedModality: {
        code: string;
        name: string;
    };
    submissionDeadline: Date;
    status: RegistrationStatus;
    isPaid: boolean;
    paymentInfo?: {
        amount?: number;
        paidAt?: Date;
        method?: string;
        transactionId?: string;
    };
    registeredAt: Date;
    cancelledAt?: Date;
    notes?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const EventRegistrationSchema: Schema<IEventRegistration> = new Schema(
    {
        eventId: { type: Schema.Types.ObjectId, required: true, ref: 'EventCertificate' },
        userId: { type: String, required: true },
        userName: { type: String, required: true },
        userEmail: { type: String, required: true },
        userCpf: { type: String, required: false },
        userPhone: { type: String, required: false },
        selectedModality: {
            code: { type: String, required: true },
            name: { type: String, required: true },
        },
        submissionDeadline: { type: Date, required: true },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'cancelled', 'waitlist'],
            default: 'confirmed',
            required: true,
        },
        isPaid: { type: Boolean, default: false },
        paymentInfo: {
            amount: { type: Number, required: false },
            paidAt: { type: Date, required: false },
            method: { type: String, required: false },
            transactionId: { type: String, required: false },
        },
        registeredAt: { type: Date, default: Date.now },
        cancelledAt: { type: Date, required: false },
        notes: { type: String, required: false },
    },
    {
        timestamps: true,
        collection: 'certificates.participants',
    }
);

// Índice composto para evitar inscrição duplicada
EventRegistrationSchema.index({ eventId: 1, userId: 1 }, { unique: true });

const EventRegistrationModel: Model<IEventRegistration> =
    mongoose.models.EventRegistration ||
    mongoose.model<IEventRegistration>('EventRegistration', EventRegistrationSchema);

export default EventRegistrationModel;
