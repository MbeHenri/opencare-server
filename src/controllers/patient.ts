import { Request, Response } from "express";
import Doctor from "../models/Doctor";
import Room from "../models/Room";
import { getHospitalRepository } from "../repositories/Hospital";
import HospitalRepository from "../repositories/Hospital/repository";
import { getRoomRepository } from "../repositories/Room";
import RoomRepository from "../repositories/Room/repository";
import BaseController from "./base";

class PatientController extends BaseController {

    hospital_rep: HospitalRepository = getHospitalRepository("good");
    room_rep: RoomRepository = getRoomRepository("good");

    async getRelatedDoctors(req: Request, res: Response) {
        try {
            const patient_id = req.params.id;

            // on recupère la liste des conversations auquelles le patient est participant
            // en recupérant son mot de passe Talk
            const rooms = await this.getRelatedRooms(patient_id);

            // on récupère les docteurs réliés à chacune de ces conversations
            const doctors: Array<Doctor> = [];
            for (let i = 0; i < rooms.length; i++) {
                if (rooms[i].name.includes(patient_id)) {
                    const doctor = await this.getRelatedDoctor(rooms[i]);
                    doctors.push(doctor);
                }
            }

            res.status(200).json(doctors);
        } catch (error) {
            res.status(405).json({ message: error as string });
        }
    }

    /**
     * get a related rooms of a patient
     * @param patient_id O3 identifier of a patient
     * @returns 
     */
    async getRelatedRooms(patient_id: string): Promise<Array<Room>> {
        // on recupère le mot de passe Talk du patient 
        const password = await this.room_rep.getPasswordUser(patient_id);
        // on recupère la liste des conversations auquelles le patient est participant
        return await this.room_rep.getRelatedRooms(patient_id, password);
    }

    /**
     * get a doctor related to a room
     * @param room room
     * @returns 
     */
    async getRelatedDoctor(room: Room): Promise<Doctor> {

        let id = "";
        let names = "";
        id = room.name.split("#")[0];
        names = (await this.hospital_rep.getDoctor(id)).names;

        return {
            id: id,
            names: names,
            related_room: room,
            url_room: await this.getRoomURL(room),
        };
    }

    async getPatient(req: Request, res: Response) {
        try {
            const patient_id = req.params.id
            const patient = await this.hospital_rep.getPatientDetail(patient_id);
            res.status(200).json(patient);
        } catch (error) {
            res.status(405).json({ message: error as string });
        }
    }

    async getVisits(req: Request, res: Response) {
        try {
            const patient_id = req.params.id
            await this.hospital_rep.getVisits(patient_id);
        } catch (error) {
            res.status(405).json({ message: error as string });
        }
    }

    async getDoctorRestrictRoomDemands(req: Request, res: Response) {

    }

    async getRoomDemands(req: Request, res: Response) {

    }

    async doDemand(req: Request, res: Response) {

    }

}

export default PatientController;
