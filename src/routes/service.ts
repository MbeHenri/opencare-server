import ServiceController from '../controllers/service';
import { BaseRouter } from './base';

/**
* @swagger
* components:
*   schemas:
*     ServiceInput:
*       type: object
*       required:
*         - service_id
*         - patient_id
*       properties:
*         service_id:
*           type: string
*           description: id of service
*         patient_id:
*           type: string
*           description: id of patient 
*       example:
*         service_id: fg4sdfgdfg5sdfgdfg
*         patient_id: fg4sdfgdfg5sdfgdfg
*
*     FullServiceInput:
*       type: object
*       required:
*         - service_id
*         - patient_id
*         - doctor_id
*       properties:
*         service_id:
*           type: string
*           description: id of service
*         patient_id:
*           type: string
*           description: id of patient
*         doctor_id:
*           type: string
*           description: date of meeting 
*       example:
*         service_id: fgddfgdfg5gzdfgdfg
*         patient_id: fg4sdfgdfg5sdfgdfg
*         doctor_id: fg4sdfgdfg5sdfgdfg
*
*/

/**
 * @swagger
 * tags:
 *   name: Service
 *   description: The Service managing API
*/

class ServiceRouter extends BaseRouter {
    controller: ServiceController;
    intializeRoutes() {
        this.controller = new ServiceController();

        /**
         * @swagger
         * /service/room:
         *   get:
         *     summary: Get list of the room service relaled of a patient
         *     tags: [Service]
         *     parameters:
         *       - in: query
         *         name: service_id
         *         schema:
         *           type: string
         *         description: The service id
         *       - in: query
         *         name: patient_id
         *         schema:
         *           type: string
         *         description: The patient id
         *       - in: query
         *         name: status
         *         schema:
         *           type: string
         *         description: The status ("pay" or "unpay")
         *     responses:
         *       200:
         *         description: The service
         *       405:
         *         description: Error
         */
        this.router.get('/room', this.controller.getRoomServices);

        /**
         * @swagger
         * /service/room/doctor:
         *   post:
         *     summary: Change doctor allow to a patient for a service
         *     tags: [Service]
         *     requestBody:
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/FullServiceInput'
         *     responses:
         *       201:
         *         description: Update is a success
         *       405:
         *         description: Error
         */
        this.router.post('/room/doctor', this.controller.updateDoctorRoomService);

        /**
         * @swagger
         * /service/room/pay:
         *   post:
         *     summary: Update room service with payment
         *     tags: [Service]
         *     requestBody:
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/ServiceInput'
         *     responses:
         *       201:
         *         description: Update is a success
         *       405:
         *         description: Error
         */
        this.router.post('/room/pay', this.controller.payRoomService);

    }
}

const ServiceRoutes = new ServiceRouter().router;
export default ServiceRoutes