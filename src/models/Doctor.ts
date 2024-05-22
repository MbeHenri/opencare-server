import Room from "./Room";

interface Doctor {
    id: string,
    names: string,
    related_room: Room,
    url_room: string,
}

export default Doctor;