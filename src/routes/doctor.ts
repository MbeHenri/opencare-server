import { BaseRouter } from './base';
import DoctorController from 'src/controllers/doctor';


class DoctorRouter extends BaseRouter {
    controller = new DoctorController();

    intializeRoutes() {
        this.router.post('/:id/room', this.controller.createRoom);
        this.router.get('/:id/room', this.controller.getRelatedRooms);
        this.router.get('/:id/room/:patient_id', this.controller.getRelatedRoom);
    }
}

const doctorRoutes = new DoctorRouter().router;
export default doctorRoutes