import { FullService, Service } from "../../models/Service";
import { Patient } from "../../models/Patient";
import User from "../../models/User";
import Visit from "../../models/Visit";

class HospitalRepository {

    async getPatientDetail(patient_id: string): Promise<Patient> {
        return {
            id: "44588",
            names: "Sarah Taylor",
            gender: "F",
            age: 61,
            birthdate: new Date("1962-09-09T00:00:00.000+0000"),
            birthdateEstimated: false,
        }
    }

    async getUser(user_id: string): Promise<User> {

        return {
            id: "454588",
            names: "Jake Doctor",
        };
    }

    async getDoctors(): Promise<Array<User>> {
        return [];
    }

    async getDoctor(person_id: string): Promise<User> {

        return {
            id: "454588",
            names: "Jake Doctor",
        };
    }

    async getVisits(patient_id: string): Promise<Array<Visit>> {
        return [];
    }

    async getService(uuid: string): Promise<Service> {
        return {
            name: "Pédiatrie",
            uuid
        };
    }


    async getConcept(code: string): Promise<any> {
        return;
    }

    async getObservations(patient_id: string): Promise<Array<any>> {
        return [];
    }

    async getMedications(patient_id: string): Promise<Array<any>> {
        return [];
    }

    async getAllergies(patient_id: string): Promise<Array<any>> {
        return [];
    }

    async getConditions(patient_id: string): Promise<Array<any>> {
        return [];
    }

    async getImmunizations(patient_id: string): Promise<Array<any>> {
        return [];
    }

    async getAttachments(patient_id: string): Promise<Array<any>> {
        return [];
    }

    async getPrograms(patient_id: string): Promise<Array<any>> {
        return [];
    }

}

export default HospitalRepository;