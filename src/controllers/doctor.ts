import BaseController from "./base";
import { Request, Response } from "express";
import { hospital_rep } from "../repositories";
import { AppointmentModel, StatusAppointmentDict } from "../models/Appointment";
import { getLinkRoom } from "../utils";

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
                const appointment = await hospital_rep.getAppointement(element.uuidAppointment);

                const doctor_uuid = appointment.providers[0].uuid

                if (doctor_id == doctor_uuid) {
                    const el = {
                        // éléments de l'hopital
                        uuid: element.uuidAppointment,
                        service: appointment.service.name,
                        startDateTime: new Date(appointment.startDateTime),
                        endDateTime: new Date(appointment.endDateTime),
                        patient: appointment.patient.name,
                        statusProgress: appointment.status,

                        // élements du système
                        statusPayment: element.status,
                        linkRoom: element.tokenRoom == "" || element.status == StatusAppointmentDict["unpay"] ? null : getLinkRoom(element.tokenRoom),
                    };
                    output.push(el)
                }
            }
            res.status(200).json({ results: output });
        } catch (error) {
            res.status(405).json({ message: error as string });
        }
    }
}

export default DoctorController;
