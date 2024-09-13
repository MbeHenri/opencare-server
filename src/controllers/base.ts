import { getLinkRoom } from "src/utils";
import Room from "../models/Room";

class BaseController {

    /**
    * get a room link
    * @param room room
    * @returns 
    */
    async getRoomURL(room: Room): Promise<string> {
        return getLinkRoom(room.token)
    }
}

export default BaseController;
