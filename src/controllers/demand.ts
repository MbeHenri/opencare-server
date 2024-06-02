import { Request, Response } from "express";
import { DemandInput, DemandModel } from "../models/Demand";
import HospitalRepository from "../repositories/Hospital/repository";
import { getHospitalRepository } from "../repositories/Hospital";
import User from "../models/User";
import { RoomServiceModel } from "../models/Room";

class DemandController {

    hospital_rep: HospitalRepository = getHospitalRepository("good");

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
                    patient: (await this.hospital_rep.getPatientDetail(element.uuidPatient)) as User,
                    service: (await this.hospital_rep.getService(element.uuidService)).name,
                    status: element.status
                }
                output.push(demand)
            }
            res.status(200).json(output);

        } catch (error) {
            res.status(405).json({ message: error as string });
        }
    }

    async doDemand(req: Request, res: Response) {

        try {
            const { service_id, patient_id } = req.body

            if (!service_id) {
                throw new Error("give service id");
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
            res.status(405).json({ message: error as string });
        }
    }

    async validDemand(req: Request, res: Response) {
        try {
            const { service_id, patient_id, doctor_id } = req.body

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
                room_service = await RoomServiceModel.create({
                    uuidPatient: patient_id,
                    uuidService: service_id,
                    uuidDoctor: doctor_id,
                });
            }
            await DemandModel.updateOne({ uuidService: service_id, uuidPatient: patient_id }, { $set: { status: "validated" } });
            res.status(201).json(room_service);
        } catch (error) {
            res.status(405).json({ message: error as string });
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
            await DemandModel.updateOne({ uuidService: service_id, uuidPatient: patient_id }, { $set: { status: "rejected" } });
            const updateDemand = await DemandModel.findOne({ uuidService: service_id, uuidPatient: patient_id });
            res.status(201).json(updateDemand);
        } catch (error) {
            res.status(405).json({ message: error as string });
        }
    }

}

export default DemandController;
