import { TALK_PASSWORD, TALK_USER } from "src/repositories/env";
import Room from "../models/Room";
import { getRoomRepository } from "../repositories/Room";
import RoomRepository from "../repositories/Room/repository";
import BaseService from "./base";

class DoctorService {
    static instance: DoctorService | null = null;

    room_rep: RoomRepository;

    constructor() {
        this.room_rep = getRoomRepository("good");
    }

    /**
     * 
     * @returns patient service
     */
    static getInstance(): DoctorService {
        if (DoctorService.instance) {
            return DoctorService.instance;
        } else {
            DoctorService.instance = new DoctorService();
            return DoctorService.instance;
        }

    }
    /**
     * create a room for the digital consultation for a patient
     * @param doctor_id doctor id
     * @param patient_id patient id
     * @returns 
     */
    async createRoom(doctor_id: string, patient_id: string, patient_name: string): Promise<Room | null> {
        try {
            const room = await this.room_rep.createRoom(`${doctor_id}#${patient_id}`);
            await this.room_rep.addRoomParticipant(doctor_id, room.token);
            await this.addPatient(patient_id, patient_name, room);
            return room;
        } catch (error) {
            return null;
        }
    }

    /**
     * add a patient on a room
     * @param patient_id patient id
     * @param patient_name patient name
     * @param room room for the patient
     */
    async addPatient(patient_id: string, patient_name: string, room: Room): Promise<void> {
        try {
            const password = await this.room_rep.getPasswordUser(patient_id);
            await this.room_rep.createUser(patient_id, patient_name, password);
            await this.room_rep.addRoomParticipant(patient_id, room.token);

        } catch (error) { }
    }

    /**
    * get a room link
    * @param room room
    * @returns 
    */
    async getRoomURL(room: Room): Promise<string> {
        return await BaseService.getRoomURL(room);
    }

    /**
     * get a room related to a patient and a doctor
     * @param doctor_id 
     * @param patient_id 
     * @returns 
     */
    async getRelatedRoom(doctor_id: string, patient_id: string): Promise<Room | null> {
        try {
            const rooms = await this.room_rep.getRelatedRooms(`${TALK_USER}`, `${TALK_PASSWORD}`);
            const room = rooms.find((element) => {
                return element.name === `${doctor_id}#${patient_id}`
            })
            return room ? room : null;
        } catch (error) {
            return null
        }
    }

    async getRoomDemands(doctor_id: string): Promise<void> {
    }

    async validRommDemand(demand_id: any): Promise<void> {
    }

    async leaveRoomDemand(demand_id: any): Promise<void> {
    }

}

export default DoctorService;
