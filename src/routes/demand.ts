import DemandController from '../controllers/demand';
import { BaseRouter } from './base';


class DemandRouter extends BaseRouter {
    controller: DemandController;
    intializeRoutes() {
        this.controller = new DemandController();
        this.router.post('/', this.controller.getDemands);
        this.router.put('/send', this.controller.doDemand);
        this.router.put('/validated', this.controller.validDemand);
        this.router.put('/rejected', this.controller.rejectDemand);
    }
}

const DemandRoutes = new DemandRouter().router;
export default DemandRoutes