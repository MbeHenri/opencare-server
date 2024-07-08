import { Document, Schema, model } from "mongoose";

interface Room {
    token: string,
    name: string,
}

export type RoomDocument = Document & {
    uuidPatient: string,
    uuidDoctor: string,
    tokenRoom: string
}

const RoomSchema = new Schema({
    uuidPatient: {
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
    },

}, {
    collection: 'rooms'
});

export const RoomModel = model<RoomDocument>("Room", RoomSchema);

export default Room;