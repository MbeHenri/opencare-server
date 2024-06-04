import BaseController from "./base";
import { Request, Response } from "express";
import { hospital_rep } from "../repositories";

class DoctorController extends BaseController {

    async getDoctors(req: Request, res: Response) {
        try {
            //const doctor = await DoctorModel.findOne({ uuid: doctor_id })
            const doctors = await hospital_rep.getDoctors()
            res.status(200).json({ results: doctors });

        } catch (error) {
            res.status(405).json({ message: error });
        }
    }

    async getDoctor(req: Request, res: Response) {
        try {
            const doctor_id = req.params.id
            if (!doctor_id) {
                throw new Error("give doctor id");
            }
            //const doctor = await DoctorModel.findOne({ uuid: doctor_id })
            const doctor = await hospital_rep.getDoctor(doctor_id)

            res.status(200).json(doctor);

        } catch (error) {
            res.status(405).json({ message: error });
        }
    }

}

export default DoctorController;
