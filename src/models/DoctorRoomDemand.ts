import RoomDemand from "./RoomDemand";
import User from "./User";

interface DoctorRoomDemand extends RoomDemand { doctor: User }

export default DoctorRoomDemand;