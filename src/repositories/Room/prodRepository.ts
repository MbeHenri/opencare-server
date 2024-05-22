import { NC_BASE_URL, TALK_BASE64, TALK_BASE_PASSWORD, TALK_BASE_URL } from "../env";
import Room from "../../models/Room";
import { base64 } from "../../utils";
import RoomRepository from "./repository";
import User from "../../models/User";
import { BadResponse } from "../errors";


class ProdRoomRepository extends RoomRepository {

    async createUser(user_id: string, name: string, password: string): Promise<void> {

        var myHeaders = new Headers();
        myHeaders.append("Accept", "application/json,");
        myHeaders.append("OCS-APIRequest", "true");
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Basic ${TALK_BASE64}`);

        var raw = JSON.stringify({
            "userid": user_id,
            "displayName": name,
            "password": password
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
        };

        const response = await fetch(`${NC_BASE_URL}/cloud/users`, requestOptions);

        if (response.status === 400 || response.ok) {
            if (response.status === 400) {
                const data = await response.json()
                const status = data.ocs.statuscode as number

                if (status !== 102) {
                    throw new BadResponse()
                }
            }
        } else {
            throw new BadResponse()
        }

    }

    async createRoom(name: string = "ocare"): Promise<Room> {

        var myHeaders = new Headers();
        myHeaders.append("OCS-APIRequest", "true");
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Authorization", `Basic ${TALK_BASE64}`);

        var formdata = new FormData();
        formdata.append("roomType", "2");
        formdata.append("roomName", name);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: formdata,
        };

        const room: Room = await fetch(`${TALK_BASE_URL}/room`, requestOptions)
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                throw new BadResponse()
            })
            .then(result => {
                const data = result.ocs.data;
                return { token: data.token, name: data.displayName }
            })

        return room;
    }

    async addUserInRoom(token_room: string, user_id: string): Promise<void> {

        var myHeaders = new Headers();
        myHeaders.append("OCS-APIRequest", "true");
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Authorization", `Basic ${TALK_BASE64}}`);

        var formdata = new FormData();
        formdata.append("newParticipant", user_id);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: formdata,
        };
        await fetch(`${TALK_BASE_URL}/room/${token_room}/participants`, requestOptions)
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                throw new BadResponse()
            })
    }


    async getRelatedRooms(user_id: string, password: string): Promise<Array<Room>> {
        var myHeaders = new Headers();
        myHeaders.append("OCS-APIRequest", "true");
        myHeaders.append("Accept", "application/json");
        const basic_key = base64(`${user_id}:${password}`);
        myHeaders.append("Authorization", `Basic ${basic_key}`);

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
        };

        let rooms: Array<Room> = [];
        await fetch(`${TALK_BASE_URL}/room`, requestOptions)
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                throw new BadResponse()
            })
            .then(result => {
                const data: Array<any> = result.ocs.data;
                data.forEach(element => {
                    const name: string = element.displayName;
                    const token: string = element.token;
                    rooms.push({
                        token: token,
                        name: name
                    })
                });
            });
        return rooms;
    }

    async setRoomLinkable(token_room: string): Promise<void> {

        var myHeaders = new Headers();
        myHeaders.append("OCS-APIRequest", "true");
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Basic ${TALK_BASE64}}`);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
        };

        await fetch(`${TALK_BASE_URL}/room/${token_room}/public`, requestOptions);
    }


    async setPasswordLinkedRoom(token_room: string, password: string): Promise<void> {

        var myHeaders = new Headers();
        myHeaders.append("OCS-APIRequest", "true");
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Basic ${TALK_BASE64}}`);

        var raw = JSON.stringify({
            "password": password
        });

        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: raw,
        };

        await fetch(`${TALK_BASE_URL}/room/${token_room}/password`, requestOptions).then(response => {
            if (response.ok) {
                return response.json()
            }
            throw new BadResponse()
        });
    }

    async getRoomParticipants(token_room: string): Promise<Array<User>> {

        var myHeaders = new Headers();
        myHeaders.append("OCS-APIRequest", "true");
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Basic ${TALK_BASE64}}`);

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
        };
        const participants: Array<User> = [];
        await fetch(`${TALK_BASE_URL}/room/${token_room}/participants`, requestOptions)
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                throw new BadResponse()
            })
            .then(result => {
                const data: Array<any> = result.ocs.data;
                data.forEach(element => {
                    participants.push({
                        names: element.displayName,
                        id: element.actorId
                    })
                });
            });

        return participants;
    }

    async addRoomParticipant(user_id: string, token_room: string): Promise<void> {

        const myHeaders = new Headers();
        myHeaders.append("OCS-APIRequest", "true");
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Authorization", `Basic ${TALK_BASE64}}`);

        const formdata = new FormData();
        formdata.append("newParticipant", user_id);

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: formdata,
        };

        await fetch(`${TALK_BASE_URL}/room/${token_room}/participants`, requestOptions)
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                throw new BadResponse()
            })

    }
    
    async getPasswordUser(user_id: string): Promise<string> {
        return `${TALK_BASE_PASSWORD}`;
    }
}

export default ProdRoomRepository;