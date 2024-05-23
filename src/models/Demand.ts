import { Document, Schema, model } from "mongoose";

export type StatusDemand = "validated" | "rejected" | "processing";

export type DemandDocument = Document & {
    uuidPatient: string,
    uuidDoctor: string,
    demandDate: Date,
    meetingDate: Date,
    status: StatusDemand
}

export type DemandInput = {
    uuidPatient: string,
    uuidDoctor: string,
    meetingDate: Date,
}

const DemandSchema = new Schema({
    uuidPatient: {
        type: String,
        //unique: true,
    },
    uuidDoctor: {
        type: String,
        //unique: true,
    },
    demandDate: {
        type: Date,
        default: new Date()
    },
    meetingDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        default: "processing"
    },
}, {
    collection: 'demands'
});

export const DemandModel = model<DemandDocument>("Demand", DemandSchema);
