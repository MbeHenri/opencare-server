import { Request, Response } from "express";
import BaseController from "./base";
import { facturation_rep, hospital_rep } from "../repositories";
import { DemandModel } from "../models/Demand";
import { PatientModel } from "../models/Patient";
import { AppointmentModel, StatusAppointmentDict } from "../models/Appointment";
import { getLinkRoom } from "../utils";

class PatientController extends BaseController {

    async getPatient(req: Request, res: Response) {
        try {
            const patient_id = req.params.id
            const patient = await hospital_rep.getPatientDetail(patient_id);
            res.status(200).json(patient);
        } catch (error) {
            const err: any = error
            res.status(405).send({ name: err.name, message: err.message });
        }
    }

    async getVisits(req: Request, res: Response) {
        try {
            const patient_id = req.params.id
            const visits = await hospital_rep.getVisits(patient_id);
            res.status(200).json({ results: visits });
        } catch (error) {
            const err: any = error
            res.status(405).send({ name: err.name, message: err.message });
        }
    }

    async getObservations(req: Request, res: Response) {
        try {
            const patient_id = req.params.id
            const results = await hospital_rep.getObservations(patient_id);
            res.status(200).json({ results });
        } catch (error) {
            const err: any = error
            res.status(405).send({ name: err.name, message: err.message });
        }
    }

    async getMedications(req: Request, res: Response) {
        try {
            const patient_id = req.params.id
            const results = await hospital_rep.getMedications(patient_id);
            res.status(200).json({ results });
        } catch (error) {
            const err: any = error
            res.status(405).send({ name: err.name, message: err.message });
        }
    }

    async getAllergies(req: Request, res: Response) {
        try {
            const patient_id = req.params.id
            const results = await hospital_rep.getAllergies(patient_id);
            res.status(200).json({ results });
        } catch (error) {
            const err: any = error
            res.status(405).send({ name: err.name, message: err.message });
        }
    }

    async getConditions(req: Request, res: Response) {
        try {
            const patient_id = req.params.id
            const results = await hospital_rep.getConditions(patient_id);
            res.status(200).json({ results });
        } catch (error) {
            const err: any = error
            res.status(405).send({ name: err.name, message: err.message });
        }
    }

    async getImmunizations(req: Request, res: Response) {
        try {
            const patient_id = req.params.id
            const results = await hospital_rep.getImmunizations(patient_id);
            res.status(200).json({ results });
        } catch (error) {
            const err: any = error
            res.status(405).send({ name: err.name, message: err.message });
        }
    }

    async getAttachments(req: Request, res: Response) {
        try {
            const patient_id = req.params.id
            const results = await hospital_rep.getAttachments(patient_id);
            res.status(200).json({ results });
        } catch (error) {
            const err: any = error
            res.status(405).send({ name: err.name, message: err.message });
        }
    }

    async getPrograms(req: Request, res: Response) {
        try {
            const patient_id = req.params.id
            const results = await hospital_rep.getPrograms(patient_id);
            res.status(200).json({ results });
        } catch (error) {
            const err: any = error
            res.status(405).send({ name: err.name, message: err.message });
        }
    }

    async getDemands(req: Request, res: Response) {
        try {
            const uuidPatient = req.params.id
            const status = req.query.status;

            const filter = {};

            if (uuidPatient) {
                filter["uuidPatient"] = uuidPatient as string;
            }

            if (status) {
                filter["status"] = status as string;
            }

            //const demands = await DemandModel.find({ uuidPatient }).sort('-demandDate').exec();
            const demands = await DemandModel.find(filter).sort("-demandDate").exec();
            const output: Array<any> = []

            for (let i = 0; i < demands.length; i++) {
                const element = demands[i];

                const demand = {
                    service: (await facturation_rep.getService(element.uuidService)).name,
                    status: element.status,
                    date: element.demandDate,
                    id: element.id,
                }
                output.push(demand)
            }
            res.status(200).json({ results: output });

        } catch (error) {
            const err: any = error
            res.status(405).send({ name: err.name, message: err.message });
        }
    }

    async getInvoices(req: Request, res: Response) {
        try {
            const patient_id = req.params.id

            const patient = await PatientModel.findOne({ uuid: patient_id })
            if (!patient) {
                throw new Error("patient don't exist");
            }

            const invoices = await facturation_rep.getInvoices(patient.username)

            res.status(200).json({ results: invoices });
        } catch (error) {
            const err: any = error
            res.status(405).send({ name: err.name, message: err.message });
        }
    }

    async getAppointments(req: Request, res: Response) {
        try {
            const patient_id = req.params.id
            const status = req.query.status
            const filter = { uuidPatient: patient_id };

            if (status && ([StatusAppointmentDict["pay"], StatusAppointmentDict["unpay"]].includes(status as string))) {
                filter["status"] = status as string
            }

            const appointments = await AppointmentModel.find(filter);
            const output: Array<any> = [];
            for (let index = 0; index < appointments.length; index++) {
                const element = appointments[index];

                // recupération de l'appointment depuis l'hospital_rep (uuid et details du service doivent etre obtenu)
                const appointment = await hospital_rep.getAppointement(element.uuidAppointment);
                //const doctor_uuid = appointment.providers[0].uuid

                const el = {
                    // éléments de l'hopital
                    uuid: element.uuidAppointment,
                    service: appointment.service.name,
                    startDateTime: new Date(appointment.startDateTime),
                    endDateTime: new Date(appointment.endDateTime),
                    patient: appointment.patient.name,
                    statusProgress: appointment.status,

                    // élements du système
                    idInvoice: element.idInvoice,
                    price: (await facturation_rep.getService(appointment.service.uuid)).price,
                    statusPayment: element.status,
                    linkRoom: element.tokenRoom == "" || element.status == StatusAppointmentDict["unpay"] ? null : getLinkRoom(element.tokenRoom),
                };
                output.push(el)
            }
            res.status(200).json({ results: output });
        } catch (error) {
            res.status(405).json({ message: error as string });
        }
    }
}

export default PatientController;

