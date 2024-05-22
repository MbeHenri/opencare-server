import Patient from "../../models/Patient";
import User from "../../models/User";
import Visit from "../../models/Visit";

class HospitalRepository {

    async getPatientDetail(patient_id: string): Promise<Patient> {
        return {
            o3_id: "44588",
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
    
    async getDoctor(person_id: string): Promise<User> {

        return {
            id: "454588",
            names: "Jake Doctor",
        };
    }
    
    async getVisits(patient_id: string): Promise<Array<Visit>> {
        return [];
    }
}

export default HospitalRepository;