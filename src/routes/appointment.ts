import AppointmentController from '../controllers/appointment';
import { BaseRouter } from './base';

/**
* @swagger
* components:
*   schemas:
*     AppointmentDoctorInput:
*       type: object
*       required:
*         - doctor_id
*       properties:
*         doctor_id:
*           type: string
*           description: id of doctor 
*       example:
*         doctor_id: fg4sdfgdfg5sdfgdfg
*/

/**
 * @swagger
 * tags:
 *   name: Appointment
 *   description: The appointment managing API
*/

class AppointmentRouter extends BaseRouter {
    controller: AppointmentController;
    intializeRoutes() {
        this.controller = new AppointmentController();

        /**
         * @swagger
         * /appointment/{id}/doctor:
         *   post:
         *     summary: Change doctor allow to a patient for a appointment
         *     tags: [Appointment]
         *     parameters:
         *       - in: path
         *         name: id
         *         schema:
         *           type: string
         *         required: true
         *         description: The appointment id
         *     requestBody:
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/AppointmentDoctorInput'
         *     responses:
         *       201:
         *         description: Update is a success
         *       405:
         *         description: Error
         */
        this.router.post('/:id/doctor', this.controller.updateDoctorAppointment);

        /**
         * @swagger
         * /appointment/{id}/pay:
         *   put:
         *     summary: Update room appointment with payment
         *     tags: [Appointment]
         *     parameters:
         *       - in: path
         *         name: id
         *         schema:
         *           type: string
         *         required: true
         *         description: The appointment id
         *     responses:
         *       201:
         *         description: Update is a success
         *       405:
         *         description: Error
         */
        this.router.put('/:id/pay', this.controller.payAppointment);
    }
}

const AppointmentRoutes = new AppointmentRouter().router;
export default AppointmentRoutes