import { Request, Response } from "express";
import { DemandInput, DemandModel, StatusDemand } from "../models/Demand";

class DemandController {

    async getDemands(req: Request, res: Response) {
        try {
            const uuidDoctor = req.query.doctor_id
            const uuidPatient = req.query.patient_id
            const filter = {};
            if (uuidDoctor) {
                filter["uuidDoctor"] = uuidDoctor
            }
            if (uuidPatient) {
                filter["uuidPatient"] = uuidPatient
            }

            const demands = await DemandModel.find(filter).sort('-createdAt').exec();
            res.status(200).json(demands);

        } catch (error) {
            res.status(405).json({ message: error as string });
        }
    }

    async doDemand(req: Request, res: Response) {

        try {
            const { metting_date_str, doctor_id } = req.body

            if (!metting_date_str) {
                throw new Error("give metting date");
            }

            if (!doctor_id) {
                throw new Error("give doctor id");
            }

            const input: DemandInput = {
                meetingDate: new Date(metting_date_str),
                uuidPatient: req.params.id,
                uuidDoctor: doctor_id
            }
            const demand = await DemandModel.create(input)
            res.status(201).json({ demandDate: demand.demandDate });

        } catch (error) {
            res.status(405).json({ message: error as string });
        }
    }

    async validDemand(req: Request, res: Response) {
        try {
            const { doctor_id, patient_id, demandDate } = req.body
            const updateDemand = await this.updateDemand(patient_id, demandDate, doctor_id, "validated");
            res.status(201).json(updateDemand);
        } catch (error) {
            res.status(405).json({ message: error as string });
        }
    }

    async rejectDemand(req: Request, res: Response) {
        try {
            const { doctor_id, patient_id, demandDate } = req.body
            const updateDemand = await this.updateDemand(patient_id, demandDate, doctor_id, "rejected");
            res.status(201).json(updateDemand);
        } catch (error) {
            res.status(405).json({ message: error as string });
        }
    }

    private async updateDemand(patient_id: any, demandDate: any, doctor_id: string, status: StatusDemand) {
        if (!doctor_id) {
            throw new Error("give doctor id");
        }
        if (!patient_id) {
            throw new Error("give patient id");
        }
        if (!demandDate) {
            throw new Error("give demand date");
        }
        await DemandModel.updateOne({ uuidDoctor: doctor_id, uuidPatient: patient_id, demandDate: new Date(demandDate) }, { $set: { status } });
        const updateDemand = await DemandModel.findOne({ uuidDoctor: doctor_id, uuidPatient: patient_id, demandDate });
        return updateDemand;
    }

}

export default DemandController;
