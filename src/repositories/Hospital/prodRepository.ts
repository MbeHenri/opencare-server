import { O3_BASE64, O3_BASEF_URL, O3_BASE_URL } from "../env";
import { Patient } from "../../models/Patient";
import User from "../../models/User";
import Visit from "../../models/Visit";
import HospitalRepository from "./repository";
import { BadResponse } from "../errors";


class ProdHospitalRepository extends HospitalRepository {

    async getPatientDetail(patient_id: string): Promise<Patient> {


        let myHeaders = new Headers();
        myHeaders.append("Authorization", `Basic ${O3_BASE64}`);

        let requestOptions = {
            method: 'GET',
            headers: myHeaders,
        };

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


    async getConcept(code: string): Promise<any> {
        let myHeaders = new Headers();
        myHeaders.append("Authorization", `Basic ${O3_BASE64}`);

        let requestOptions = {
            method: 'GET',
            headers: myHeaders,
        };

        return await fetch(`${O3_BASE_URL}/concept/${code}`, requestOptions)
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                throw new BadResponse()
            })
    }

    async getObservations(patient_id: string): Promise<Array<any>> {
        let myHeaders = new Headers();
        myHeaders.append("Authorization", `Basic ${O3_BASE64}`);

        let requestOptions = {
            method: 'GET',
            headers: myHeaders,
        };

        return await fetch(`${O3_BASEF_URL}/Observation?subject:Patient=${patient_id}&_summary=data&_sort=-date&_count=100`, requestOptions)
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                throw new BadResponse()
            }).then((data) => {
                return data.entry
            })
    }

    async getMedications(patient_id: string): Promise<Array<any>> {
        let myHeaders = new Headers();
        myHeaders.append("Authorization", `Basic ${O3_BASE64}`);

        let requestOptions = {
            method: 'GET',
            headers: myHeaders,
        };

        //console.log(O3_BASE_URL);
        return await fetch(`${O3_BASE_URL}/order?patient=${patient_id}&status=ACTIVE&v=custom:(uuid,dosingType,orderNumber,accessionNumber,patient:ref,action,careSetting:ref,previousOrder:ref,dateActivated,scheduledDate,dateStopped,autoExpireDate,orderType:ref,encounter:ref,orderer:(uuid,display,person:(display)),orderReason,orderReasonNonCoded,orderType,urgency,instructions,commentToFulfiller,drug:(uuid,display,strength,dosageForm:(display,uuid),concept),dose,doseUnits:ref,frequency:ref,asNeeded,asNeededCondition,quantity,quantityUnits:ref,numRefills,dosingInstructions,duration,durationUnits:ref,route:ref,brandName,dispenseAsWritten)`, requestOptions)
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                throw new BadResponse()
            }).then((data) => {
                return data.results
            })
    }

    async getAllergies(patient_id: string): Promise<Array<any>> {
        let myHeaders = new Headers();
        myHeaders.append("Authorization", `Basic ${O3_BASE64}`);

        let requestOptions = {
            method: 'GET',
            headers: myHeaders,
        };

        //console.log(O3_BASE_URL);
        return await fetch(`${O3_BASEF_URL}/AllergyIntolerance?patient=${patient_id}&_summary=data`, requestOptions)
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                throw new BadResponse()
            }).then((data) => {
                return data.entry
            })
    }

    async getConditions(patient_id: string): Promise<Array<any>> {
        let myHeaders = new Headers();
        myHeaders.append("Authorization", `Basic ${O3_BASE64}`);

        let requestOptions = {
            method: 'GET',
            headers: myHeaders,
        };

        //console.log(O3_BASE_URL);
        return await fetch(`${O3_BASEF_URL}/Condition?patient=${patient_id}&_summary=data`, requestOptions)
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                throw new BadResponse()
            }).then((data) => {
                return data.entry
            })
    }

    async getImmunizations(patient_id: string): Promise<Array<any>> {
        let myHeaders = new Headers();
        myHeaders.append("Authorization", `Basic ${O3_BASE64}`);

        let requestOptions = {
            method: 'GET',
            headers: myHeaders,
        };

        //console.log(O3_BASE_URL);
        return await fetch(`${O3_BASEF_URL}/Immunization?patient=${patient_id}&_summary=data`, requestOptions)
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                throw new BadResponse()
            }).then((data) => {
                return data.entry
            })
    }

    async getAttachments(patient_id: string): Promise<Array<any>> {
        let myHeaders = new Headers();
        myHeaders.append("Authorization", `Basic ${O3_BASE64}`);

        let requestOptions = {
            method: 'GET',
            headers: myHeaders,
        };

        //console.log(O3_BASE_URL);
        return await fetch(`${O3_BASE_URL}/attachment?patient=${patient_id}&includeEncounterless=true`, requestOptions)
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                throw new BadResponse()
            }).then((data) => {
                return data.results
            })
    }

    async getPrograms(patient_id: string): Promise<Array<any>> {
        let myHeaders = new Headers();
        myHeaders.append("Authorization", `Basic ${O3_BASE64}`);

        let requestOptions = {
            method: 'GET',
            headers: myHeaders,
        };

        return await fetch(`${O3_BASE_URL}/programenrollment?patient=${patient_id}&v=custom:(uuid,display,program,dateEnrolled,dateCompleted,location:(uuid,display))`, requestOptions)
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                throw new BadResponse()
            }).then((data) => {
                return data.results
            })
    }

}

export default ProdHospitalRepository