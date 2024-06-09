import { Request, Response } from "express";
import { RoomServiceModel } from "../models/Room";
import { PatientModel } from "../models/Patient";
import { facturation_rep, hospital_rep, room_rep } from "../repositories";

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

    async getRoomServices(req: Request, res: Response) {
        try {
            const uuidService = req.query.service_id
            const uuidPatient = req.query.patient_id
            const status = req.query.status
            const filter = {};

            if (uuidService) {
                filter["uuidService"] = uuidService
            }
            if (uuidPatient) {
                filter["uuidPatient"] = uuidPatient
            }
            if (status && (["pay", "unpay"].includes(status as string))) {
                filter["status"] = status == "pay" ? "pay" : "unpay"
            }

            const room_services = await RoomServiceModel.find(filter).sort('-dateMeeting').exec();
            const output: Array<any> = [];
            for (let index = 0; index < room_services.length; index++) {
                const element = room_services[index];
                const room = {
                    service: {
                        id: element.uuidService,
                        name: (await facturation_rep.getService(element.uuidService)).name,
                    },
                    dateMeeting: element.dateMeeting,
                    status: element.status,
                    tokenRoom: element.tokenRoom == "" ? null : element.tokenRoom,
                    patient: (await hospital_rep.getPatientDetail(element.uuidPatient))
                };
                output.push(room)
            }
            res.status(200).json(output);
        } catch (error) {
            res.status(405).json({ message: error as string });
        }
    }

    async updateDoctorRoomService(req: Request, res: Response) {
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
                uuidService: service_id,
            });

            if (room_service) {

                const doctor = await hospital_rep.getDoctor(doctor_id)
                if (room_service.tokenRoom != "") {
                    // on ajte le docteur dans la salle de reunion patient-service si elle existe
                    await room_rep.addParticipant(room_service.uuidDoctor, doctor.names, room_service.tokenRoom)
                }
                await room_service.updateOne(
                    {
                        $set: { uuidDoctor: doctor_id }
                    }
                )
                res.status(201).json(doctor);

            } else {
                res.status(404).json({ message: "room service don't exist" });
            }
        } catch (error) {
            res.status(405).json({ message: error as string });
        }
    }

    async payRoomService(req: Request, res: Response) {
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
                uuidService: service_id,
            });

            if (room_service) {

                if (room_service.status === "unpay") {

                    // créer la reunion si néccessaire
                    let tokenRoom = room_service.tokenRoom
                    const service = await facturation_rep.getService(room_service.uuidService)
                    const patient = await PatientModel.findOne({ uuid: patient_id })
                    if (!patient) {
                        throw new Error("patient don't exist");
                    }

                    const doctor = await hospital_rep.getDoctor(room_service.uuidDoctor)

                    if (tokenRoom == "") {
                        tokenRoom = (await room_rep.createRoom(`${service.name} (${patient.person.display} - ${patient.username}) `)).token
                        // construction des comptes Talk du docteur et du patient si néccessaire
                        await room_rep.addParticipant(patient.id, patient.person.display, tokenRoom)
                        await room_rep.addParticipant(service.uuid, doctor.names, tokenRoom)
                    }

                    // signaler que le service a été payé et qu'un espace de consultation a été crée
                    await room_service.updateOne({ $set: { status: "pay", tokenRoom } })
                    res.status(201).json({ status: "pay", tokenRoom });

                } else {
                    res.status(202).json({ status: room_service.status, tokenRoom: room_service.tokenRoom });
                }
            } else {
                res.status(404).json({ message: "room service don't exist" });
            }
        } catch (error) {
            res.status(405).json({ message: error as string });
        }
    }
}

export default ServiceController;
