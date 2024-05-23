import { Document, Schema, model } from "mongoose";

type StatusDemand = "validated" | "rejected" | "processing";

type DemandDocument = Document & {
    uuidPatient: string,
    uuidDoctor: string,
    demandDate: Date,
    meetingDate: Date,
    status: StatusDemand
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
