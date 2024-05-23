import DoctorController from '../controllers/doctor';
import { BaseRouter } from './base';


class DoctorRouter extends BaseRouter {
    controller: DoctorController;
    intializeRoutes() {
        this.controller = new DoctorController();
        this.router.post('/:id/room', this.controller.createRoom);
        this.router.get('/:id/room', this.controller.getRelatedRooms);
        this.router.get('/:id/room/:patient_id', this.controller.getRelatedRoom);
        this.router.get('/:id/demand', this.controller.getDemands);
        this.router.post('/:id/demand/validated', this.controller.validDemand);
        this.router.post('/:id/demand/rejected', this.controller.rejectDemand);
    }
}

const doctorRoutes = new DoctorRouter().router;
export default doctorRoutes