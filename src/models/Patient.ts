import mongoose, { Document } from "mongoose";
import bcrypt from "bcrypt";

// mongoDB
// *******
export type PatientDocument = Document & {
  uuid: string,
  username: string,
  password: string,
  person: {
    display: string
  },
  comparePassword(candidatePassword: string): Promise<boolean>;
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

PatientSchema.pre<PatientDocument>("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

PatientSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const PatientModel = mongoose.model<PatientDocument>("Patient", PatientSchema);

export interface Patient {
  id: string,
  names: string,
  gender: string,
  age: number,
  birthdate: Date,
  birthdateEstimated: boolean,
}
