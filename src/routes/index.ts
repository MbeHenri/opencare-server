import { Application } from "express";
import patientRoutes from "./patient";
import doctorRoutes from "./doctor";

export default class Routes {
    constructor(app: Application) {
        app.use("/patient", patientRoutes);
        app.use("/doctor", doctorRoutes);
    }
}
