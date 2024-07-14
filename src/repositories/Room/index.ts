import { TypeRepository } from "../TypeRepository";
import ProdRoomRepository from "./prodRepository";
import RoomRepository from "./repository";

export function getRoomRepository(t: TypeRepository = "fake"): RoomRepository {
    if (t === "fake") {
        return new RoomRepository();
    }
    return new ProdRoomRepository();
}
