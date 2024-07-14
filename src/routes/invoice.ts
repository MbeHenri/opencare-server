
import InvoiceController from '../controllers/invoice';
import { BaseRouter } from './base';

/**
 * @swagger
 * tags:
 *   name: Invoice
 *   description: The Invoice managing API
*/

class InvoiceRouter extends BaseRouter {
    controller: InvoiceController;
    intializeRoutes() {
        this.controller = new InvoiceController();


        /**
         * @swagger
         * /invoice/{id}:
         *   get:
         *     summary: Get a detail of a Invoice
         *     tags: [Invoice]
         *     parameters:
         *       - in: path
         *         name: id
         *         schema:
         *           type: string
         *         required: true
         *         description: The invoice id
         *     responses:
         *       200:
         *         description: The Invoice
         *       405:
         *         description: Error
         */
        this.router.get('/:id', this.controller.getInvoice);

        /**
         * @swagger
         * /invoice/{id}/pdf:
         *   get:
         *     summary: get pdf of invoice
         *     tags: [Invoice]
         *     parameters:
         *       - in: path
         *         name: id
         *         schema:
         *           type: string
         *         required: true
         *         description: The invoice id
         *     responses:
         *       200:
         *         description: The pdf file of invoice
         *       405:
         *         description: Error
         */
        this.router.get('/:id/pdf', this.controller.getInvoicePdf);
    }
}

const InvoiceRoutes = new InvoiceRouter().router;
export default InvoiceRoutes