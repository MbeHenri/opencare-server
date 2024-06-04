import { O3_BASE64, O3_BASE_URL } from "../env";
import { Patient } from "../../models/Patient";
import User from "../../models/User";
import Visit from "../../models/Visit";
import HospitalRepository from "./repository";
import { BadResponse } from "../errors";
import { log } from "console";


class ProdHospitalRepository extends HospitalRepository {

    async getPatientDetail(patient_id: string): Promise<Patient> {


        let myHeaders = new Headers();
        myHeaders.append("Authorization", `Basic ${O3_BASE64}`);

        let requestOptions = {
            method: 'GET',
            headers: myHeaders,
        };

        //console.log(O3_BASE_URL);
        const result: Patient = await fetch(`${O3_BASE_URL}/patient/${patient_id}?v=full`, requestOptions)
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                throw new BadResponse()
            })
            .then(result => {
                const person = result.person;
                return {
                    id: result.uuid,
                    names: person.display,
                    gender: person.gender,
                    age: person.age,
                    birthdate: new Date(person.birthdate),
                    birthdateEstimated: person.birthdateEstimated,
                }
            })

        return result;
    }

    async getUser(user_id: string): Promise<User> {

        let myHeaders = new Headers();
        myHeaders.append("Authorization", `Basic ${O3_BASE64}`);

        let requestOptions = {
            method: 'GET',
            headers: myHeaders,
        };

        const result: User = await fetch(`${O3_BASE_URL}/user/${user_id}?v=full`, requestOptions)
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                throw new BadResponse()
            })
            .then(result => {
                const person = result.person;
                return {
                    id: person.uuid,
                    names: person.display,
                }
            })

        return result;
    }

    async getDoctors(): Promise<Array<User>> {
        let myHeaders = new Headers();
        myHeaders.append("Authorization", `Basic ${O3_BASE64}`);

        let requestOptions = {
            method: 'GET',
            headers: myHeaders,
        };
        let doctors: Array<User> = [];
        await fetch(`${O3_BASE_URL}/provider?v=custom:(person:(uuid,display))`, requestOptions)
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                throw new BadResponse()
            })
            .then(({ results }) => {
                const data: Array<any> = results
                data.forEach((doctor) => {
                    doctors.push(
                        {
                            id: doctor.person.uuid,
                            names: doctor.person.display,
                        }
                    )
                })
            })
        return doctors;
    }

    async getDoctor(person_id: string): Promise<User> {
        let myHeaders = new Headers();
        myHeaders.append("Authorization", `Basic ${O3_BASE64}`);

        let requestOptions = {
            method: 'GET',
            headers: myHeaders,
        };

        const result: User = await fetch(`${O3_BASE_URL}/person/${person_id}?v=custom:(uuid,display)`, requestOptions)
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                throw new BadResponse()
            })
            .then(({ uuid, display }) => {
                return {
                    id: uuid,
                    names: display,
                }
            })

        return result;
    }

    async getVisits(patient_id: string): Promise<Array<Visit>> {
        let myHeaders = new Headers();
        myHeaders.append("Authorization", `Basic ${O3_BASE64}`);

        let requestOptions = {
            method: 'GET',
            headers: myHeaders,
        };

        let visits: Array<Visit> = [];
        await fetch(`${O3_BASE_URL}/encounter?patient=${patient_id}&v=custom:(visit:(visitType:(display),startDatetime,stopDatetime,encounters:(display,encounterType:(display))),encounterDatetime,obs:(concept:(display),obsDatetime,value))`, requestOptions)
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                throw new BadResponse()
            })
            .then(({ results }) => {
                const data: Array<any> = results;
                data.forEach((element) => {
                    visits.push(
                        {
                            type: element.visit.visitType.display as string,
                            startDate: new Date(element.visit.startDatetime as string),
                            stopDate: new Date(element.visit.stopDatetime as string),
                            encounterDate: new Date(element.encounterDatetime as string),
                            observations: (element.obs as Array<any>).map(ob => {
                                return {
                                    name: ob.concept.display as string,
                                    date: new Date(ob.obsDatetime as string),
                                    value: ob.value
                                }
                            }),
                            encounters: (element.visit.encounters as Array<any>).map(
                                encounter => {
                                    return {
                                        name: encounter.display as string,
                                        type: encounter.encounterType.display as string
                                    }
                                }
                            )
                        }
                    )
                })
            })

        return visits;
    }

}

export default ProdHospitalRepository