import { getFacturationRepository } from "./Facturation"
import { getHospitalRepository } from "./Hospital"
import { getRoomRepository } from "./Room"

export const hospital_rep = getHospitalRepository("good")
export const room_rep = getRoomRepository("good")
export const facturation_rep = getFacturationRepository('good')