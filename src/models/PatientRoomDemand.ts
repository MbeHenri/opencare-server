import RoomDemand from "./RoomDemand";
import User from "./User";

interface PatientRoomDemand extends RoomDemand { patient: User }

export default PatientRoomDemand;