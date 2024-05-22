import mongoose, { Document } from "mongoose";

// mongoDB
// *******
export type PatientDocument = Document & {
  uuid: string,
  username: string,
  password: string,
}

const PatientSchema = new mongoose.Schema({
  uuid: {
    type: String,
    unique: true,
  },
  username: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
}, {
  collection: 'roles'
});

export const PatientModel = mongoose.model<PatientDocument>("Patient", PatientSchema);

export interface Patient {
  o3_id: string,
  names: string,
  gender: string,
  age: number,
  birthdate: Date,
  birthdateEstimated: boolean,
}
