import DoctorController from '../controllers/doctor';
import { BaseRouter } from './base';


class DoctorRouter extends BaseRouter {
    controller: DoctorController;
    intializeRoutes() {
        this.controller = new DoctorController();
        this.router.get('/:id', this.controller.getDoctor);
        this.router.post('/:id/room', this.controller.createRoom);
        this.router.get('/:id/room', this.controller.getRelatedRooms);
        this.router.get('/:id/room/:patient_id', this.controller.getRelatedRoom);
    }
}

const doctorRoutes = new DoctorRouter().router;
export default doctorRoutes