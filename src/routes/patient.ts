import PatientController from '../controllers/patient';
import { BaseRouter } from './base';


class PatientRouter extends BaseRouter {
    controller :PatientController;
    
    intializeRoutes() {
        this.controller = new PatientController()
        this.router.get('/:id/doctor', this.controller.getRelatedDoctors);
        this.router.get('/:id', this.controller.getPatient);
        this.router.get('/:id/visit', this.controller.getVisits);
    }
}
const patientRoutes = new PatientRouter().router;
export default patientRoutes;