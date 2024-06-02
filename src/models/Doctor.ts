import { Schema, model } from "mongoose";
import Room from "./Room";

export interface Doctor {
    id: string,
    names: string,
    related_room: Room,
    url_room: string,
}


export type DoctorDocument = Document & {
    uuid: string,
    names: string,
    speciality: string,
    presentation: string,
    notes: {
        value: number
    }[]
}

const DoctorSchema = new Schema({
    uuid: {
        type: String,
        unique: true,
    },
    names: {
        type: String,
        //unique: true,
    },
    speciality: {
        type: String,
    },
    presentation: {
        type: String,
        default: ""
    },
    notes: [{
        type: Number,
    }]

}, {
    collection: 'doctors'
});

export const DoctorModel = model<DoctorDocument>("Doctor", DoctorSchema);
