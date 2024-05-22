import Room from "../../models/Room";
import User from "../../models/User";

class RoomRepository {

    async createRoom(name: string = "ocare"): Promise<Room> {

        return {
            token: "sdfsdf",
            name: "id1#id2"
        };
    }

    async createUser(user_id: string, name: string, password: string): Promise<void> {
    }

    async addUserInRoom(token_room: string, user_id: string): Promise<void> {
    }

    async getRelatedRooms(user_id: string, password: string): Promise<Array<Room>> {

        return [];
    }

    async setRoomLinkable(token_room: string): Promise<void> {
    }

    async setPasswordLinkedRoom(token_room: string, password: string): Promise<void> {
    }

    async getPasswordUser(user_id: string): Promise<string> {
        return `TalkPassword`;
    }

    async getRoomParticipants(token_room: string): Promise<Array<User>> {
        return [];
    }

    async addRoomParticipant(user_id: string, token_room: string): Promise<void> {}
}

export default RoomRepository;
