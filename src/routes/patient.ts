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

        /**
         * @swagger
         * /patient/{id}/observation:
         *   get:
         *     summary: Get related the observations of a patient
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
         *         description: The list of observations contains observations of the patient
         *       405:
         *         description: Error
         */
        this.router.get('/:id/observation', this.controller.getObservations);

        /**
         * @swagger
         * /patient/{id}/medication:
         *   get:
         *     summary: Get related the medications of a patient
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
         *         description: The list of medications contains medications of the patient
         *       405:
         *         description: Error
         */
        this.router.get('/:id/medication', this.controller.getMedications);

        /**
         * @swagger
         * /patient/{id}/allergie:
         *   get:
         *     summary: Get related the allergies of a patient
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
         *         description: The list of allergies contains allergies of the patient
         *       405:
         *         description: Error
         */
        this.router.get('/:id/allergie', this.controller.getAllergies);

        /**
         * @swagger
         * /patient/{id}/condition:
         *   get:
         *     summary: Get related the conditions of a patient
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
         *         description: The list of conditions contains conditions of the patient
         *       405:
         *         description: Error
         */
        this.router.get('/:id/condition', this.controller.getConditions);

        /**
         * @swagger
         * /patient/{id}/immunization:
         *   get:
         *     summary: Get related the immunizations of a patient
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
         *         description: The list of immunizations contains immunizations of the patient
         *       405:
         *         description: Error
         */
        this.router.get('/:id/immunization', this.controller.getImmunizations);

        /**
         * @swagger
         * /patient/{id}/attachment:
         *   get:
         *     summary: Get related the attachments of a patient
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
         *         description: The list of attachments contains attachments of the patient
         *       405:
         *         description: Error
         */
        this.router.get('/:id/attachment', this.controller.getAttachments);

        /**
         * @swagger
         * /patient/{id}/program:
         *   get:
         *     summary: Get related the programs of a patient
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
         *         description: The list of programs contains programs of the patient
         *       405:
         *         description: Error
         */
        this.router.get('/:id/program', this.controller.getPrograms);

        /**
         * @swagger
         * /patient/{id}/invoice:
         *   get:
         *     summary: Get related the invoices of a patient
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
         *         description: The list of invoices contains invoices of the patient
         *       405:
         *         description: Error
         */
        this.router.get('/:id/invoice', this.controller.getInvoices);

        /* A GERER */
        /**
         * @swagger
         * /patient/{id}/appointment:
         *   get:
         *     summary: Get related the appointments of a patient
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
         *         description: The list of appointments contains appointments of the patient
         *       405:
         *         description: Error
         */
        this.router.get('/:id/appointment', this.controller.getAppointments);

        /**
         * @swagger
         * /patient/{id}/demand:
         *   get:
         *     summary: Get related the demands of a patient
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
         *         description: The list of demands contains demands of the patient
         *       405:
         *         description: Error
         */
        this.router.get('/:id/demand', this.controller.getDemands);

    }
}
const patientRoutes = new PatientRouter().router;
export default patientRoutes;