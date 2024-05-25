import mongoose, { Document } from "mongoose";

// mongoDB
// *******
export type PatientDocument = Document & {
  uuid: string,
  username: string,
  password: string,
  person: {
    display: string
  }
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
  person: {
    display: {
      type: String
    }
  }
}, {
  collection: 'patients'
});

export const PatientModel = mongoose.model<PatientDocument>("Patient", PatientSchema);

export interface Patient {
  id: string,
  names: string,
  gender: string,
  age: number,
  birthdate: Date,
  birthdateEstimated: boolean,
}
