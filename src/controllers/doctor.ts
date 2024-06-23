import BaseController from "./base";
import { Request, Response } from "express";
import { hospital_rep } from "../repositories";
import { AppointmentModel, StatusAppointmentDict } from "../models/Appointment";

class DoctorController extends BaseController {

    async getDoctors(req: Request, res: Response) {
        try {
            //const doctor = await DoctorModel.findOne({ uuid: doctor_id })
            const doctors = await hospital_rep.getDoctors()
            res.status(200).json({ results: doctors });

        } catch (error) {
            const err: any = error
            res.status(405).send({ name: err.name, message: err.message });
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
            const err: any = error
            res.status(405).send({ name: err.name, message: err.message });
        }
    }

    async getAppointments(req: Request, res: Response) {
        try {
            const doctor_id = req.params.id
            const filter = { status: { $ne: StatusAppointmentDict["unpay"] } };

            const appointments = await AppointmentModel.find(filter);
            const output: Array<any> = [];
            for (let index = 0; index < appointments.length; index++) {
                const element = appointments[index];

                // recupération de l'appointment depuis l'hospital_rep (uuid et details du service doivent etre obtenu)
                const room = {
                    /* 
                    service: {
                        id: element.uuidService,
                        name: (await facturation_rep.getService(element.uuidService)).name,
                    }, 
                    dateMeeting: element.dateMeeting,
                    */
                    status: element.status,
                    tokenRoom: element.tokenRoom == "" || element.status == StatusAppointmentDict["unpay"] ? null : element.tokenRoom,
                    patient: (await hospital_rep.getPatientDetail(element.uuidPatient))
                };
                output.push(room)
            }
            res.status(200).json(output);
        } catch (error) {
            res.status(405).json({ message: error as string });
        }
    }
}

export default DoctorController;
