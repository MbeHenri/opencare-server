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

        const response = await fetch(`${NC_BASE_URL}/cloud/users`, requestOptions)

        if (response.status === 400 || response.ok) {

            if (response.status === 400) {
                const data = await response.json()
                const status = data.ocs.meta.statuscode as number

                if (status != 102) {
                    throw new BadResponse("L'utilisateur existe déjà dans Talk", "TALK")
                }
            }
        } else {
            throw new BadResponse(`Impossible de créer un utilisateur (${response.status})`, "TALK")
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
                throw new BadResponse(`Impossible de créer une room (${response.status})`, "TALK")
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
                throw new BadResponse(`Impossible d'ajouter l'utilisateur à la room (${response.status})`, "TALK")
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
                throw new BadResponse(`Impossible de recupérer les rooms liées à l'utilisateur (${response.status})`, "TALK")
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

        await fetch(`${TALK_BASE_URL}/room/${token_room}/public`, requestOptions).then(response => {
            if (response.ok) {
                return response.json()
            }
            throw new BadResponse(`Impossible de rendre une room joignable par lien (${response.status})`, "TALK")
        })
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
            throw new BadResponse(`Impossible de mettre à jour le mot de passe du lien d'une room (${response.status})`, "TALK")
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
                throw new BadResponse(`Impossible de recupérer les participants (${response.status})`, "TALK")
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


    async getPasswordUser(user_id: string): Promise<string> {
        return `${TALK_BASE_PASSWORD}`;
    }

    async addParticipant(username: string, displayName: string, token: string): Promise<void> {
        try {
            const password = await this.getPasswordUser(username);
            await this.createUser(username, displayName, password);
            await this.addUserInRoom(token, username);

        } catch (error) { }
    }
}

export default ProdRoomRepository;