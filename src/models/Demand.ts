import { Document, Schema, model } from "mongoose";

export const StatusDemandDict = { 'validated': "0", 'rejected': "1", 'processing': "2" }

export type DemandDocument = Document & {
    uuidPatient: string,
    uuidService: string,
    demandDate: Date,
    status: string,
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
        default: StatusDemandDict["processing"]
    },
}, {
    collection: 'demands'
});

export const DemandModel = model<DemandDocument>("Demand", DemandSchema);
