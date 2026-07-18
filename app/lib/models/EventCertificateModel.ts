import mongoose, { Model, Schema } from 'mongoose';
import { ObjectId } from 'mongodb';
import React from 'react';

type PaymentOptions =
    | { isPaid: false; price?: never }
    | { isPaid: true; price: number };

export type TimelineItem = {
    id?: ObjectId;
    startDate: Date;
    endDate: Date;
    description: string;
};

export type EventStatusConfig =
    | {
        status: 'DRAFT';
        timeLine?: TimelineItem[];
        registrationStartDate?: Date;
        registrationEndDate?: Date;
    }
    | {
        status: 'PUBLISHED_OPEN';
        timeLine: TimelineItem[];
        registrationStartDate: Date;
        registrationEndDate: Date;
    }
    | {
        status: 'PUBLISHED_CLOSED' | 'CERTIFICATE_ONLY';
        timeLine: TimelineItem[];
        registrationStartDate?: Date;
        registrationEndDate?: Date;
    };

export type IEventCertificate = {
    _id: ObjectId;
    eventName: string;
    eventDescription: string;
    styleContainer: React.CSSProperties;
    styleContainerVerse: {
        containerStyle?: React.CSSProperties;
        rowsStyle?: React.CSSProperties;
        headerStyle?: React.CSSProperties;
    };
    styleFrontTopperText: React.CSSProperties;
    styleFrontBottomText: React.CSSProperties;
    styleNameText: React.CSSProperties;
    registrationCount: number;
    templatePath: string;
    templateVersePath?: string;
    eventType: string;
    documentVersion: string;
    maxParticipants: number;
    isOpen: boolean;
    useStatementFormat: boolean;
    statusDetails?: EventStatusConfig;
} & PaymentOptions;

const TimelineItemSchema = new Schema(
    {
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        description: { type: String, required: true },
    },
    { _id: false },
);

const EventCertificateSchema = new Schema<IEventCertificate>(
    {
        eventName: { type: String, required: true },
        eventDescription: { type: String, required: true },
        styleContainerVerse: {
            containerStyle: { type: Object, required: false },
            rowsStyle: { type: Object, required: false },
            headerStyle: { type: Object, required: false },
        },
        styleContainer: { type: Object, required: true },
        styleFrontTopperText: { type: Object, required: true },
        styleFrontBottomText: { type: Object, required: true },
        styleNameText: { type: Object, required: true },
        templatePath: { type: String, required: true },
        templateVersePath: { type: String, required: false },
        eventType: { type: String, required: true },
        registrationCount: { type: Number, required: true, default: 0 },
        documentVersion: { type: String, required: false, default: '2.0' },
        maxParticipants: { type: Number, required: true },
        isOpen: { type: Boolean, required: true, default: true },
        isPaid: { type: Boolean, required: true },
        price: {
            type: Number,
            required: function (this: IEventCertificate) {
                return this.isPaid === true;
            },
        },
        useStatementFormat: { type: Boolean, default: false },
        statusDetails: {
            status: {
                type: String,
                enum: ['DRAFT', 'PUBLISHED_OPEN', 'PUBLISHED_CLOSED', 'CERTIFICATE_ONLY'],
                required: false,
            },
            registrationStartDate: { type: Date, required: false },
            registrationEndDate: {
                type: Date,
                required: false,
                validate: {
                    validator: function (this: IEventCertificate, value?: Date) {
                        const startDate = this.statusDetails?.registrationStartDate;
                        return !value || !startDate || value > startDate;
                    },
                    message: 'A data de fim das inscrições deve ser posterior à data de início.',
                },
            },
            timeLine: {
                type: [TimelineItemSchema],
                default: undefined,
                required: false,
                validate: {
                    validator: function (this: IEventCertificate, value?: TimelineItem[]) {
                        const status = this.statusDetails?.status;
                        return !status || status === 'DRAFT' || (Array.isArray(value) && value.length > 0);
                    },
                    message: 'A timeline deve conter ao menos uma etapa para eventos publicados.',
                },
            },
        },
    },
    { timestamps: true, collection: 'certificates.events' },
);

const EventCertificateModel: Model<IEventCertificate> =
    mongoose.models.EventCertificate ||
    mongoose.model<IEventCertificate>('EventCertificate', EventCertificateSchema);

export default EventCertificateModel;
