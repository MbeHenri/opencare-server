import { Document, Schema, model } from "mongoose";

export type StatusDemand = "validated" | "rejected" | "processing";

export type DemandDocument = Document & {
    uuidPatient: string,
    uuidService: string,
    demandDate: Date,
    status: StatusDemand
}

export type DemandInput = {
    uuidPatient: string,
    uuidService: string,
}

const DemandSchema = new Schema({
    uuidPatient: {
        type: String,
        //unique: true,
    },
    uuidService: {
        type: String,
        //unique: true,
    },
    demandDate: {
        type: Date,
        default: new Date()
    },
    status: {
        type: String,
        default: "processing"
    },
}, {
    collection: 'demands'
});

export const DemandModel = model<DemandDocument>("Demand", DemandSchema);
