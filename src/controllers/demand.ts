import { Request, Response } from "express";
import { DemandInput, DemandModel } from "../models/Demand";
import User from "../models/User";
import { RoomServiceModel } from "../models/Room";
import { hospital_rep } from "../repositories";

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
                    patient: (await hospital_rep.getPatientDetail(element.uuidPatient)) as User,
                    service: (await hospital_rep.getService(element.uuidService)).name,
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
                status: { $in: ["validated", "processing"] }
            })

            if (demand) {
                // une demande a déjà été validé ou est en attente
                res.status(202).json({ demandDate: demand.demandDate });
            } else {
                // on crée une nouvelle demande
                const input: DemandInput = {
                    uuidPatient: patient_id,
                    uuidService: service_id
                }
                demand = await DemandModel.create(input)
                res.status(201).json({ demandDate: demand.demandDate });
            }

        } catch (error) {
            res.status(405).json({ message: error });
        }
    }

    async validDemand(req: Request, res: Response) {
        try {
            const { service_id, patient_id, doctor_id, date_meeting } = req.body

            if (!service_id) {
                throw new Error("give service id");
            }
            if (!patient_id) {
                throw new Error("give patient id");
            }
            if (!doctor_id) {
                throw new Error("give doctor id");
            }

            let room_service = await RoomServiceModel.findOne({
                uuidPatient: patient_id,
                uuidService: service_id
            })

            if (!room_service) {
                const input = {
                    uuidPatient: patient_id,
                    uuidService: service_id,
                    uuidDoctor: doctor_id
                }
                if (date_meeting) {
                    input["date_meeting"] = date_meeting
                }

                room_service = await RoomServiceModel.create(input);
            }
            await DemandModel.updateOne({ uuidService: service_id, uuidPatient: patient_id }, { $set: { status: "validated" } });
            //demand = await DemandModel.findOne({ uuidService: service_id, uuidPatient: patient_id });
            res.status(201).json({
                status: "validated"
            });

        } catch (error) {
            res.status(405).json({ message: error });
        }
    }

    async rejectDemand(req: Request, res: Response) {
        try {
            const { service_id, patient_id } = req.body

            if (!service_id) {
                throw new Error("give service id");
            }
            if (!patient_id) {
                throw new Error("give patient id");
            }

            let room_service = await RoomServiceModel.findOne({
                uuidPatient: patient_id,
                uuidService: service_id
            })

            if (room_service) {
                res.status(408).json({ message: "demand don't reject because this patient have already validated for this service" });
            } else {
                await DemandModel.updateOne({ uuidService: service_id, uuidPatient: patient_id }, { $set: { status: "rejected" } });
                //const updateDemand = await DemandModel.findOne({ uuidService: service_id, uuidPatient: patient_id });
                res.status(201).json({ status: "rejected" });
            }
        } catch (error) {
            res.status(405).json({ message: error });
        }
    }

}

export default DemandController;
