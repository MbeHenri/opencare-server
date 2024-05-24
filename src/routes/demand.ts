import DemandController from '../controllers/demand';
import { BaseRouter } from './base';

/**
* @swagger
* components:
*   schemas:
*     DemandDo:
*       type: object
*       required:
*         - doctor_id
*         - metting_date
*       properties:
*         doctor_id:
*           type: string
*           description: id of doctor
*         metting_date:
*           type: string
*           description: date of meeting 
*       example:
*         doctor_id: fg4sdfgdfg5sdfgdfg
*         metting_date: 2024-30-07
*
*     StateDemand:
*       type: object
*       required:
*         - doctor_id
*         - metting_date
*       properties:
*         doctor_id:
*           type: string
*           description: id of doctor
*         patient_id:
*           type: string
*           description: id of patient
*         metting_date:
*           type: string
*           description: date of meeting 
*       example:
*         doctor_id: fgddfgdfg5gzdfgdfg
*         patient_id: fg4sdfgdfg5sdfgdfg
*         metting_date: 2024-30-07
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
         *       - in: path
         *         name: id
         *         schema:
         *           type: string
         *         required: true
         *         description: The demand id
         *       - in: query
         *         name: doctor_id
         *         schema:
         *           type: string
         *         description: The doctor id
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
         * /demand/do:
         *   post:
         *     summary: do a demand for meeting
         *     tags: [Demand]
         *     requestBody:
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/DemandDo'
         *     responses:
         *       201:
         *         description: The list of patient
         *       405:
         *         description: Error
         */
        this.router.post('/do', this.controller.doDemand);

        /**
         * @swagger
         * /demand/validate:
         *   put:
         *     summary: validate a demand
         *     tags: [Demand]
         *     requestBody:
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/StateDemand'
         *     responses:
         *       201:
         *         description: demand is validated
         *       405:
         *         description: Error
         */
        this.router.put('/validate', this.controller.validDemand);

        /**
         * @swagger
         * /demand/reject:
         *   put:
         *     summary: reject a demand
         *     tags: [Demand]
         *     requestBody:
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/StateDemand'
         *     responses:
         *       201:
         *         description: demand is rejected
         *       405:
         *         description: Error
         */
        this.router.put('/reject', this.controller.rejectDemand);
    }
}

const DemandRoutes = new DemandRouter().router;
export default DemandRoutes