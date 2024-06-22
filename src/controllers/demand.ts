import { Request, Response } from "express";
import { DemandInput, DemandModel, StatusDemandDict } from "../models/Demand";
import { facturation_rep, hospital_rep } from "../repositories";
import { AppointmentModel } from "../models/Appointment";
import { PatientModel } from "../models/Patient";

class DemandController {

    async getDemands(req: Request, res: Response) {
        try {
            const uuidService = req.query.service_id
            const uuidPatient = req.query.patient_id
            const filter = {};
            if (uuidService) {
                filter["uuidService"] = uuidService
            }
            if (uuidPatient) {
                filter["uuidPatient"] = uuidPatient
            }

            const demands = await DemandModel.find(filter).sort('-demandDate').exec();
            const output: Array<any> = []

            for (let i = 0; i < demands.length; i++) {
                const element = demands[i];

                const demand = {
                    patient: {
                        uuid: element.uuidPatient,
                        names: (await hospital_rep.getPatientDetail(element.uuidPatient)).names
                    },
                    service: (await facturation_rep.getService(element.uuidService)).name,
                    status: element.status
                }
                output.push(demand)
            }
            res.status(200).json({ results: output });

        } catch (error) {
            res.status(405).json({ message: error });
        }
    }

    async doDemand(req: Request, res: Response) {

        try {
            const { service_id, patient_id } = req.body

            if (!service_id) {
                throw new Error("give service id");
            }

            if (!patient_id) {
                throw new Error("give patient id");
            }

            let demand = await DemandModel.findOne({
                uuidPatient: patient_id,
                uuidService: service_id,
                status: StatusDemandDict["processing"]
            })

            if (demand) {
                // une demande a déjà est en attente
                res.status(202).json({ demandDate: demand.demandDate });
            } else {
                // on crée une nouvelle demande
                const input: DemandInput = {
                    uuidPatient: patient_id,
                    uuidService: service_id
                }
                demand = await DemandModel.create(input)

                res.status(201).json({ id: demand.id, demandDate: demand.demandDate });
            }

        } catch (error) {
            res.status(405).json({ message: error });
        }
    }

    async validDemand(req: Request, res: Response) {
        try {
            const demand_id = req.params.id;
            const { doctor_id, date_meeting } = req.body

            if (!doctor_id) {
                throw new Error("give doctor id");
            }

            // controles sur la demande
            const demand = await DemandModel.findById(demand_id)
            if (!demand) {
                throw new Error("la demande n'existe pas")
            }

            if (demand.status != StatusDemandDict['processing']) {
                throw new Error("la demande n'est pas en attente")
            }

            // controles sur le patient
            const patient = await PatientModel.findOne({ uuid: demand.uuidPatient })
            if (!patient) {
                throw new Error("patient don't exist");
            }

            // creation d'une rencontre dans l'hopital
            const uuidAppointment = "";

            // creéation de la facture
            const invoice_id = await facturation_rep.createInvoice(patient.username, [demand.uuidService])

            // enregistrement de la rencontre
            AppointmentModel.create({
                uuidAppointment: uuidAppointment,
                uuidPatient: demand.uuidPatient,
                idInvoice: invoice_id,
            })


            // mis à jour de la demande
            demand.updateOne({ $set: { status: StatusDemandDict["validated"] } })
            //const demand = await DemandModel.findById(demand_id)

            res.status(201).json({
                id: demand.id,
                status: StatusDemandDict["validated"]
            });

        } catch (error) {
            res.status(405).json({ message: error });
        }
    }

    async rejectDemand(req: Request, res: Response) {
        try {
            const demand_id = req.params.id;

            // controles sur la demande
            const demand = await DemandModel.findById(demand_id)
            if (!demand) {
                throw new Error("la demande n'existe pas")
            }

            if (demand.status != StatusDemandDict['processing']) {
                throw new Error("la demande n'est pas en attente")
            }

            demand.updateOne({ $set: { status: StatusDemandDict['rejected'] } });
            //const updateDemand = await DemandModel.findOne({ uuidService: service_id, uuidPatient: patient_id });
            res.status(201).json({ status: "rejected" });

        } catch (error) {
            res.status(405).json({ message: error });
        }
    }

}

export default DemandController;
