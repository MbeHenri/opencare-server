import { Request, Response } from "express";
import { facturation_rep } from "../repositories";

class ServiceController {

    async getService(req: Request, res: Response) {
        try {
            const service_id = req.params.id
            const service = await facturation_rep.getService(service_id);
            res.status(200).json(service);
        } catch (error) {
            res.status(405).json({ message: error });
        }
    }

    async setService(req: Request, res: Response) {
        try {
            const service_id = req.params.id
            const price = req.body.price
            if (!price) {
                throw new Error("get price");
            }
            const service = await facturation_rep.setPriceService(service_id, parseInt(price));
            res.status(200).json(service);
        } catch (error) {
            res.status(405).json({ message: error });
        }
    }

    async getServices(req: Request, res: Response) {
        try {
            const services = await facturation_rep.getServices();
            res.status(200).json({ results: services });
        } catch (error) {
            res.status(405).json({ message: error });
        }
    }
}

export default ServiceController;
