import { Request, Response } from "express";
import HospitalRepository from "../repositories/Hospital/repository";
import { getHospitalRepository } from "../repositories/Hospital";
import { RoomServiceModel } from "../models/Room";
import RoomRepository from "../repositories/Room/repository";
import { getRoomRepository } from "../repositories/Room";
import { PatientModel } from "../models/Patient";
import { DoctorModel } from "../models/Doctor";

class ServiceController {

    hospital_rep: HospitalRepository = getHospitalRepository("good");
    room_rep: RoomRepository = getRoomRepository("good");

    async getRoomServices(req: Request, res: Response) {
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

            const room_services = await RoomServiceModel.find(filter).sort('-dateMeeting').exec();
            const output: Array<any> = [];
            for (let index = 0; index < room_services.length; index++) {
                const element = room_services[index];
                const room = {
                    service: {
                        id: element.uuidService,
                        name: (await this.hospital_rep.getService(element.uuidService)).name,
                    },
                    dateMeeting: element.dateMeeting,
                    status: element.status,
                    token: element.tokenRoom,
                    patient: (await this.hospital_rep.getPatientDetail(element.uuidPatient))
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

                if (room_service.tokenRoom != "") {
                    const patient = await PatientModel.findOne({ uuid: patient_id })
                    if (!patient) {
                        throw new Error("patient don't exist");
                    }
                    this.addParticipant(room_service.uuidDoctor, patient.person.display, room_service.tokenRoom)

                    const doctor = await DoctorModel.findOne({ uuid: room_service.uuidDoctor })
                    if (!doctor) {
                        throw new Error("doctor don't exist");
                    }
                    this.addParticipant(room_service.uuidDoctor, doctor.names, room_service.tokenRoom)
                }

                await RoomServiceModel.updateOne(
                    { uuidPatient: patient_id, uuidService: service_id },
                    {
                        $set: { uuidDoctor: doctor_id }
                    }
                )

                room_service = await RoomServiceModel.findOne({
                    uuidPatient: patient_id,
                    uuidService: service_id,
                })

                res.status(201).json(room_service);
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
                    const service = await this.hospital_rep.getService(room_service.uuidService)
                    const patient = await PatientModel.findOne({ uuid: patient_id })
                    if (!patient) {
                        throw new Error("patient don't exist");
                    }
                    const doctor = await DoctorModel.findOne({ uuid: room_service.uuidDoctor })
                    if (!doctor) {
                        throw new Error("doctor don't exist");
                    }

                    if (room_service.tokenRoom == "") {
                        tokenRoom = (await this.room_rep.createRoom(`Espace de consultation de ${service.name} du patient ${patient.username} `)).token
                    }

                    // construction des comptes Talk du docteur et du patient si néccessaire
                    this.addParticipant(patient_id, patient.person.display, tokenRoom)
                    this.addParticipant(room_service.uuidDoctor, doctor.names, tokenRoom)

                    // Signaler que le service a été payé
                    await RoomServiceModel.updateOne({
                        uuidPatient: patient_id,
                        uuidService: service_id,
                    }, {
                        $set: {
                            status: "pay"
                        }
                    })
                    room_service = await RoomServiceModel.findOne({
                        uuidPatient: patient_id,
                        uuidService: service_id,
                    });

                    res.status(201).json(room_service);

                } else {
                    res.status(201).json({ message: "room service is already pay" });
                }
            } else {
                res.status(404).json({ message: "room service don't exist" });
            }
        } catch (error) {
            res.status(405).json({ message: error as string });
        }
    }

    async addParticipant(id: string, name: string, token: string): Promise<void> {
        try {
            const password = await this.room_rep.getPasswordUser(id);
            await this.room_rep.createUser(id, name, password);
            await this.room_rep.addRoomParticipant(id, token);

        } catch (error) { }
    }
}

export default ServiceController;
