import { Request, Response } from "express";
import Room from "../models/Room";
import { getRoomRepository } from "../repositories/Room";
import RoomRepository from "../repositories/Room/repository";
import { TALK_HOST, TALK_PORT } from "../repositories/env";

class BaseController {
    room_rep: RoomRepository = getRoomRepository("good");


    /**
    * get a room link
    * @param room room
    * @returns 
    */
    async getRoomURL(room: Room): Promise<string> {
        return `http://${TALK_HOST}:${TALK_PORT}/call/${room.token}`;
    }
}

export default BaseController;
