import { Document, Schema, model } from "mongoose";

interface Room {
    token: string,
    name: string,
}

export type StatusRoomService = "pay" | "unpay";

export type RoomServiceDocument = Document & {
    uuidPatient: string,
    uuidService: string,
    uuidDoctor: string,
    tokenRoom: string,
    status: StatusRoomService,
    dateMeeting: Date;
}

export type RoomServiceInput = {
    uuidPatient: string,
    uuidService: string,
    uuidDoctor: string,
}

const RoomServiceSchema = new Schema({
    uuidPatient: {
        type: String,
        //unique: true,
    },
    uuidService: {
        type: String,
        //unique: true,
    },
    uuidDoctor: {
        type: String,
        //unique: true,
    },
    tokenRoom: {
        type: String,
        //unique: true,
        default: ""
    },
    status: {
        type: String,
        default: "unpay"
    },
    dateMeeting: {
        type: Date,
        default: new Date()
    }

}, {
    collection: 'room_services'
});

export const RoomServiceModel = model<RoomServiceDocument>("RoomService", RoomServiceSchema);

export default Room;