import PatientController from '../controllers/patient';
import { BaseRouter } from './base';

/**
 * @swagger
 * tags:
 *   name: Patient
 *   description: The patient managing API
*/

class PatientRouter extends BaseRouter {
    controller: PatientController;

    intializeRoutes() {
        this.controller = new PatientController()

        /**
         * @swagger
         * /patient/{id}:
         *   get:
         *     summary: Get patient detail
         *     tags: [Patient]
         *     parameters:
         *       - in: path
         *         name: id
         *         schema:
         *           type: string
         *         required: true
         *         description: The patient id
         *     responses:
         *       200:
         *         description: The patient
         *       405:
         *         description: Error
         */
        this.router.get('/:id', this.controller.getPatient);

        /**
         * @swagger
         * /patient/{id}/visit:
         *   get:
         *     summary: Get related the visits of a patient
         *     tags: [Patient]
         *     parameters:
         *       - in: path
         *         name: id
         *         schema:
         *           type: string
         *         required: true
         *         description: The patient id
         *     responses:
         *       200:
         *         description: The list of visits contains observations of the patient
         *       405:
         *         description: Error
         */
        this.router.get('/:id/visit', this.controller.getVisits);
    }
}
const patientRoutes = new PatientRouter().router;
export default patientRoutes;