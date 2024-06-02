import User from "./User";

export interface Service {
    uuid: string,
    name: string,
}

export interface FullService {
    uuid: string,
    name: string,
    doctors: Array<User>
}