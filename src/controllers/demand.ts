import { Request, Response } from "express";
import { DemandInput, DemandModel, StatusDemand } from "../models/Demand";

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

            const demands = await DemandModel.find(filter).sort('-createdAt').exec();
            res.status(200).json(demands);

        } catch (error) {
            res.status(405).json({ message: error as string });
        }
    }

    async doDemand(req: Request, res: Response) {

        try {
            const { metting_date, service_id } = req.body

            if (!metting_date) {
                throw new Error("give metting date");
            }

            if (!service_id) {
                throw new Error("give service id");
            }

            const input: DemandInput = {
                meetingDate: new Date(metting_date),
                uuidPatient: req.params.id,
                uuidService: service_id
            }
            const demand = await DemandModel.create(input)
            res.status(201).json({ demandDate: demand.demandDate });

        } catch (error) {
            res.status(405).json({ message: error as string });
        }
    }

    async validDemand(req: Request, res: Response) {
        try {
            const { service_id, patient_id, demand_date } = req.body
            const updateDemand = await this.updateDemand(patient_id, demand_date, service_id, "validated");
            res.status(201).json(updateDemand);
        } catch (error) {
            res.status(405).json({ message: error as string });
        }
    }

    async rejectDemand(req: Request, res: Response) {
        try {
            const { service_id, patient_id, demand_date } = req.body
            const updateDemand = await this.updateDemand(patient_id, demand_date, service_id, "rejected");
            res.status(201).json(updateDemand);
        } catch (error) {
            res.status(405).json({ message: error as string });
        }
    }

    private async updateDemand(patient_id: any, demandDate: any, service_id: string, status: StatusDemand) {
        if (!service_id) {
            throw new Error("give service id");
        }
        if (!patient_id) {
            throw new Error("give patient id");
        }
        if (!demandDate) {
            throw new Error("give demand date");
        }
        await DemandModel.updateOne({ uuidService: service_id, uuidPatient: patient_id, demandDate: new Date(demandDate) }, { $set: { status } });
        const updateDemand = await DemandModel.findOne({ uuidService: service_id, uuidPatient: patient_id, demandDate });
        return updateDemand;
    }

}

export default DemandController;
