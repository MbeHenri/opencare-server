import { Application } from "express";
import patientRoutes from "./patient";
import doctorRoutes from "./doctor";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { REST_DOCS_OPTIONS } from "../docs";
import DemandRoutes from "./demand";
import ServiceRoutes from "./service";
import AppointmentRoutes from "./appointment";
import InvoiceRoutes from "./invoice";

export default class Routes {
    static register(app: Application) {
        app.use("/patient", patientRoutes);
        app.use("/doctor", doctorRoutes);
        app.use("/demand", DemandRoutes);
        app.use("/service", ServiceRoutes);
        app.use("/appointment", AppointmentRoutes);
        app.use("/invoice", InvoiceRoutes);
        app.use(
            "/api-docs",
            swaggerUi.serve,
            swaggerUi.setup(swaggerJSDoc(REST_DOCS_OPTIONS))
        );
    }
}
