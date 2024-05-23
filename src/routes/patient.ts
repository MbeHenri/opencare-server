import { BaseRouter } from './base';
import PatientController from 'src/controllers/patient';


class PatientRouter extends BaseRouter {
    controller = new PatientController();

    intializeRoutes() {
        this.router.get('/:id/doctor', this.controller.getRelatedDoctors);
        this.router.get('/:id', this.controller.getPatient);
        this.router.get('/:id/visit', this.controller.getVisits);
    }
}
const patientRoutes = new PatientRouter().router;
export default patientRoutes;