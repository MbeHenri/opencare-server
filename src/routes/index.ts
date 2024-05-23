import { Application } from "express";
import patientRoutes from "./patient";
import doctorRoutes from "./doctor";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { REST_DOCS_OPTIONS } from "src/docs";

export default class Routes {
    static register(app: Application) {
        app.use("/patient", patientRoutes);
        app.use("/doctor", doctorRoutes);
        app.use(
            "/api-docs",
            swaggerUi.serve,
            swaggerUi.setup(swaggerJSDoc(REST_DOCS_OPTIONS), { explorer: true })
        );
    }
}
