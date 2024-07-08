import { TypeRepository } from "../TypeRepository";
import HospitalRepository from "./repository";
import ProdHospitalRepository from "./prodRepository";

export function getHospitalRepository(t: TypeRepository = "fake"): HospitalRepository {
    if (t === "fake") {
        return new HospitalRepository();
    }
    return new ProdHospitalRepository();
}
