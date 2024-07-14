import { TypeRepository } from "../TypeRepository";
import FacturationRepository from "./repository";
import ProdFacturationRepository from "./prodRepository";

export function getFacturationRepository(t: TypeRepository = "fake"): FacturationRepository {
    if (t === "fake") {
        return new FacturationRepository();
    }
    return new ProdFacturationRepository();
}
