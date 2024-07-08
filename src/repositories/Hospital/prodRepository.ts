import { O3_BASE64, O3_BASEF_URL, O3_BASE_URL } from "../env";
import { Patient } from "../../models/Patient";
import User from "../../models/User";
import Visit from "../../models/Visit";
import HospitalRepository from "./repository";
import { BadResponse } from "../errors";
import { Doctor } from "../../models/Doctor";


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
                throw new BadResponse(`Impossible de recuperer les details du patient depuis l'hopital (${response.status})`, "O3")
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
                throw new BadResponse(`Impossible de recuperer l'utilisateur depuis l'hopital (${response.status})`, "O3")
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

    async getDoctors(): Promise<Array<Doctor>> {
        let myHeaders = new Headers();
        myHeaders.append("Authorization", `Basic ${O3_BASE64}`);

        let requestOptions = {
            method: 'GET',
            headers: myHeaders,
        };
        let doctors: Array<Doctor> = [];
        await fetch(`${O3_BASE_URL}/provider?v=custom:(uuid,identifier,person:(uuid,display))`, requestOptions)
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                throw new BadResponse(`Impossible de recuperer les docteurs depuis l'hopital (${response.status})`, "O3")
            })
            .then(({ results }) => {
                const data: Array<any> = results
                data.forEach((doctor) => {
                    doctors.push(
                        {
                            uuid: doctor.uuid,
                            username: doctor.identifier,
                            person: {
                                uuid: doctor.person.uuid,
                                display: doctor.person.display
                            },
                        }
                    )
                })
            })
        return doctors;
    }

    async getDoctor(uuid: string): Promise<Doctor> {
        let myHeaders = new Headers();
        myHeaders.append("Authorization", `Basic ${O3_BASE64}`);

        let requestOptions = {
            method: 'GET',
            headers: myHeaders,
        };

        const result: Doctor = await fetch(`${O3_BASE_URL}/provider/${uuid}?v=custom:(uuid,identifier,person:(uuid,display))`, requestOptions)
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                throw new BadResponse(`Impossible de recuperer le docteur depuis l'hopital (${response.status})`, "O3")
            })
            .then((doctor) => {
                return {
                    uuid: doctor.uuid,
                    username: doctor.identifier,
                    person: {
                        uuid: doctor.person.uuid,
                        display: doctor.person.display
                    },
                }
            })

        return result;
    }

    // ajout AMO
  async getVisits(patient_id: string): Promise<Array<Visit>> {
    let myHeaders = new Headers();
    myHeaders.append("Authorization", `Basic ${O3_BASE64}`);

    let requestOptions = {
      method: "GET",
      headers: myHeaders,
    };

    return await fetch(
      `${O3_BASE_URL}/visit?patient=${patient_id}&v=custom:(uuid,encounters:(uuid,diagnoses:(uuid,display,rank,diagnosis),form:(uuid,display),encounterDatetime,orders:full,obs:full,encounterType:(uuid,display,viewPrivilege,editPrivilege),encounterProviders:(uuid,display,encounterRole:(uuid,display),provider:(uuid,person:(uuid,display)))),visitType:(uuid,name,display),startDatetime,stopDatetime,patient,attributes:(attributeType:ref,display,uuid,value)&limit=5`,
      requestOptions
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new BadResponse();
      })
      .then((data) => {
        return data.results;
      });
  }

    /*async getVisits(patient_id: string): Promise<Array<Visit>> {
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
                throw new BadResponse(`Impossible de recuperer la liste des visite depuis l'hopital (${response.status})`, "O3")
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
    }*/


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
                throw new BadResponse(`Impossible de recuperer le concept depuis l'hopital (${response.status})`, "O3")
            })
    }

    // Ajout AMO
  async getObservations(patient_id: string): Promise<Array<any>> {
    let myHeaders = new Headers();
    myHeaders.append("Authorization", `Basic ${O3_BASE64}`);

    let requestOptions = {
      method: "GET",
      headers: myHeaders,
    };

    return await fetch(
      `${O3_BASEF_URL}/Observation?subject:Patient=${patient_id}&code=5085AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%2C5086AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%2C5087AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%2C5088AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%2C5092AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%2C5090AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%2C5089AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%2C5242AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%2C165095AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%2C1343AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA&_summary=data&_sort=-date&_count=100`,
      requestOptions
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new BadResponse();
      })
      .then((data) => {
        return data.entry;
      });
  }

    /*async getObservations(patient_id: string): Promise<Array<any>> {
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
                throw new BadResponse(`Impossible de recuperer les observations du patient depuis l'hopital (${response.status})`, "O3")
            }).then((data) => {
                return data.entry
            })
    }*/

  async getMedications(patient_id: string): Promise<Array<any>> {
    let myHeaders = new Headers();
    myHeaders.append("Authorization", `Basic ${O3_BASE64}`);

    let requestOptions = {
      method: "GET",
      headers: myHeaders,
    };

    //console.log(O3_BASE_URL);
    return await fetch(
      `${O3_BASE_URL}/order?patient=${patient_id}&t=drugorder&status=ACTIVE&v=custom:(uuid,dosingType,orderNumber,accessionNumber,patient:ref,action,careSetting:ref,previousOrder:ref,dateActivated,scheduledDate,dateStopped,autoExpireDate,orderType:ref,encounter:ref,orderer:(uuid,display,person:(display)),orderReason,orderReasonNonCoded,orderType,urgency,instructions,commentToFulfiller,drug:(uuid,display,strength,dosageForm:(display,uuid),concept),dose,doseUnits:ref,frequency:ref,asNeeded,asNeededCondition,quantity,quantityUnits:ref,numRefills,dosingInstructions,duration,durationUnits:ref,route:ref,brandName,dispenseAsWritten)`,
      requestOptions
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new BadResponse();
      })
      .then((data) => {
        return data.results;
      });
  }

    /*async getMedications(patient_id: string): Promise<Array<any>> {
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
                throw new BadResponse(`Impossible de recuperer les médicaments du patient depuis l'hopital (${response.status})`, "O3")
            }).then((data) => {
                return data.results
            })
    }*/

  // Ajout AMO
  async getAllergies(patient_id: string): Promise<Array<any>> {
    const res: any = [];
    let myHeaders = new Headers();
    myHeaders.append("Authorization", `Basic ${O3_BASE64}`);

    let requestOptions = {
      method: "GET",
      headers: myHeaders,
    };

    //console.log(O3_BASE_URL);
    return await fetch(
      `${O3_BASEF_URL}/AllergyIntolerance?patient=${patient_id}&_summary=data`,
      requestOptions
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new BadResponse();
      })
      .then((data) => {
        data.entry.map((item) => {
          res.push(item.resource);
        });
        return res;
      });
  }

    /*async getAllergies(patient_id: string): Promise<Array<any>> {
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
                throw new BadResponse(`Impossible de recuperer les allergies du patient depuis l'hopital (${response.status})`, "O3")
            }).then((data) => {
                return data.entry
            })
    }*/

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
                throw new BadResponse(`Impossible de recuperer les conditions du patient depuis l'hopital (${response.status})`, "O3")
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
                throw new BadResponse(`Impossible de recuperer les imminizations du patient depuis l'hopital (${response.status})`, "O3")
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
                throw new BadResponse(`Impossible de recuperer les attachements du patient depuis l'hopital (${response.status})`, "O3")
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
                throw new BadResponse(`Impossible de recuperer les programmes du patient depuis l'hopital (${response.status})`, "O3")
            }).then((data) => {
                return data.results
            })
    }


    async getAppointements(): Promise<Array<any>> {
        let myHeaders = new Headers();
        myHeaders.append("Authorization", `Basic ${O3_BASE64}`);

        let requestOptions = {
            method: 'GET',
            headers: myHeaders,
        };

        return await fetch(`${O3_BASE_URL}/appointments`, requestOptions)
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                throw new BadResponse(`Impossible de recuperer les rencontres depuis l'hopital (${response.status})`, "O3")
            })
    }

    async getPatientAppointements(patient_id: string): Promise<Array<any>> {

        let myHeaders = new Headers();
        myHeaders.append("Authorization", `Basic ${O3_BASE64}`);

        const raw = JSON.stringify({
            patientUuid: patient_id,
            startDate: "2024-01-01"
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
        };

        return await fetch(`${O3_BASE_URL}/appointments`, requestOptions)
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                throw new BadResponse(`Impossible de recuperer les rencontres du patient depuis l'hopital (${response.status})`, "O3")
            })
    }

    async getAppointement(appointment_id: string): Promise<any> {
        let myHeaders = new Headers();
        myHeaders.append("Authorization", `Basic ${O3_BASE64}`);

        let requestOptions = {
            method: 'GET',
            headers: myHeaders,
        };

        return await fetch(`${O3_BASE_URL}/appointments/${appointment_id}`, requestOptions)
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                throw new BadResponse(`Impossible de recuperer la depuis l'hopital (${response.status})`, "O3");
            })
    }

    async createAppointement(patient_id: string, service_id: string, doctor_id: string, start_date: Date, end_date: Date): Promise<any> {

        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Basic ${O3_BASE64}`);

        const raw = JSON.stringify({
            "appointmentKind": "Scheduled",
            "serviceUuid": service_id,
            "status": 'Cancelled',
            "startDateTime": start_date.toISOString(),
            "endDateTime": end_date.toISOString(),
            "providers": [
                {
                    "uuid": doctor_id
                }
            ],
            "patientUuid": patient_id
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw
        };

        return await fetch(`${O3_BASE_URL}/appointment`, requestOptions)
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                throw new BadResponse(`Impossible de créer la rencontre depuis l'hopital (${response.status})`, "O3")
            })
    }

    async setAppointement(appointment_id: string, patient_id: string, service_id: string, doctor_id: string, start_date: Date, end_date: Date, status: string = 'Scheduled'): Promise<any> {

        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Basic ${O3_BASE64}`);

        const base_raw = {
            "appointmentKind": "Scheduled",
            "status": status,
            "serviceUuid": service_id,
            "startDateTime": start_date.toUTCString(),
            "endDateTime": end_date.toUTCString(),
            "patientUuid": patient_id,
            "uuid": appointment_id,
        };

        const raw = JSON.stringify(doctor_id == "" ? base_raw : {
            ...base_raw,
            providers: [
                {
                    uuid: doctor_id
                }
            ],
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw
        };

        return await fetch(`${O3_BASE_URL}/appointment`, requestOptions)
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                throw new BadResponse(`Impossible de mettre à jour la rencontre depuis l'hopital (${response.status})`, "O3")
            })
    }
}

export default ProdHospitalRepository