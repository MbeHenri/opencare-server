import { Router } from "express";

export class BaseRouter {
    router = Router();

    constructor() {
        this.intializeRoutes();
    }

    intializeRoutes() {
    }
}

