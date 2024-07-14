import DemandController from '../controllers/demand';
import { BaseRouter } from './base';

/**
* @swagger
* components:
*   schemas:
*     DemandInputCreate:
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
*     DemandInputValidate:
*       type: object
*       required:
*         - doctor_id
*       properties:
*         doctor_id:
*           type: string
*           description: id of doctor
*         date_meeting:
*           type: string
*           description: date of meeting 
*         duration:
*           type: natural number
*           description: duration of the meeting in minutes
*       example:
*         doctor_id: fg4sdfgdfg5sdfgdfg
*         date_meeting: 2024-06-04T08:07:51
*         duration: 30
*
*/

/**
 * @swagger
 * tags:
 *   name: Demand
 *   description: The demand managing API
*/
class DemandRouter extends BaseRouter {
    controller: DemandController;
    intializeRoutes() {
        this.controller = new DemandController();

        /**
         * @swagger
         * /demand:
         *   get:
         *     summary: Get list of the demand
         *     tags: [Demand]
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
         *     responses:
         *       200:
         *         description: The demand
         *       405:
         *         description: Error
         */
        this.router.get('', this.controller.getDemands);

        /**
         * @swagger
         * /demand:
         *   post:
         *     summary: create a demand
         *     tags: [Demand]
         *     requestBody:
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/DemandInputCreate'
         *     responses:
         *       201:
         *         description: The list of patient
         *       405:
         *         description: Error
         */
        this.router.post('/new', this.controller.doDemand);


        /**
         * @swagger
         * /demand/{id}/validate:
         *   post:
         *     summary: validate a demand
         *     tags: [Demand]
         *     parameters:
         *       - in: path
         *         name: id
         *         schema:
         *           type: string
         *         required: true
         *         description: The demand id
         *     requestBody:
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/DemandInputValidate'
         *     responses:
         *       201:
         *         description: demand is validated
         *       405:
         *         description: Error
         */
        this.router.post('/:id/validate', this.controller.validDemand);

        /**
         * @swagger
         * /demand/{id}/reject:
         *   put:
         *     summary: reject a demand
         *     tags: [Demand]
         *     parameters:
         *       - in: path
         *         name: id
         *         schema:
         *           type: string
         *         required: true
         *         description: The demand id
         *     responses:
         *       201:
         *         description: demand is rejected
         *       405:
         *         description: Error
         */
        this.router.put('/:id/reject', this.controller.rejectDemand);
    }
}

const DemandRoutes = new DemandRouter().router;
export default DemandRoutes