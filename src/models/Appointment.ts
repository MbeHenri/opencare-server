import { Document, Schema, model } from "mongoose";


export const StatusAppointmentDict = { "pay": "0", "unpay": "1" };


export type AppointmentDocument = Document & {
    uuidAppointment: string,
    uuidDemande: string,
    uuidPatient: string,
    idInvoice: string;
    status: string,
    tokenRoom: string,
}

const AppointmentSchema = new Schema({

    /* champs de données utiles à la creation de la rencontre */
    uuidAppointment: {
        type: String,
        unique: true
    },
    uuidDemande: {
      type: String,
      //unique: true,
    },
    uuidPatient: {
        type: String,
        //unique: true,
    },
    idInvoice: {
        type: String,
        unique: true,
    },
    status: {
        type: String,
        default: StatusAppointmentDict['unpay']
    },

    /* champ de données utiles à l'accéssibilité de la rencontre */
    tokenRoom: {
        type: String,
        //unique: true,
        default: ""
    },


}, {
    collection: 'appointments'
});

export const AppointmentModel = model<AppointmentDocument>("Appointment", AppointmentSchema);
