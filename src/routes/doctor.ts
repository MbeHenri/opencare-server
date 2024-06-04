import DoctorController from '../controllers/doctor';
import { BaseRouter } from './base';


/**
 * @swagger
 * tags:
 *   name: Doctor
 *   description: The doctor managing API
*/

class DoctorRouter extends BaseRouter {
    controller: DoctorController;
    intializeRoutes() {
        this.controller = new DoctorController();

        /**
         * @swagger
         * /doctor:
         *   get:
         *     summary: Get doctors
         *     tags: [Doctor]
         *     responses:
         *       200:
         *         description: The doctors
         *       405:
         *         description: Error
         */
        this.router.get('', this.controller.getDoctors);

        /**
         * @swagger
         * /doctor/{id}:
         *   get:
         *     summary: Get doctor detail
         *     tags: [Doctor]
         *     parameters:
         *       - in: path
         *         name: id
         *         schema:
         *           type: string
         *         required: true
         *         description: The doctor id
         *     responses:
         *       200:
         *         description: The doctor
         *       405:
         *         description: Error
         */
        this.router.get('/:id', this.controller.getDoctor);
    }
}

const doctorRoutes = new DoctorRouter().router;
export default doctorRoutes