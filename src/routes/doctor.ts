import DoctorController from '../controllers/doctor';
import { BaseRouter } from './base';


/**
 * @swagger
 * components:
 *   schemas:
 *     PatientID:
 *       type: object
 *       required:
 *         - patient_id
 *       properties:
 *         patient_id:
 *           type: string
 *           description: id of patient
 *       example:
 *         patient_id: fg4sdfgdfg5sdfgdfg
 *
 */

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

        /**
         * @swagger
         * /doctor/{id}/room:
         *   get:
         *     summary: Get related patients by meeting
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
         *         description: The list of patient
         *       405:
         *         description: Error
         */
        this.router.get('/:id/room', this.controller.getRelatedRooms);

        /**
         * @swagger
         * /doctor/{id}/room:
         *   post:
         *     summary: Create a room linking a doctor and a patient 
         *     tags: [Doctor]
         *     parameters:
         *       - in: path
         *         name: id
         *         schema:
         *           type: string
         *         required: true
         *         description: The doctor id
         *     requestBody:
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/PatientID'
         *     responses:
         *       201:
         *         description: The list of patient
         *       405:
         *         description: Error
         */
        this.router.post('/:id/room', this.controller.createRoom);
    }
}

const doctorRoutes = new DoctorRouter().router;
export default doctorRoutes