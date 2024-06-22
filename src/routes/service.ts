import ServiceController from '../controllers/service';
import { BaseRouter } from './base';

/**
* @swagger
* components:
*   schemas:
*     PriceInput:
*       type: object
*       required:
*         - price
*       properties:
*         price:
*           type: number
*           description: price of service
*       example:
*         price: 1500
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
         * /service:
         *   get:
         *     summary: Get a list of services
         *     tags: [Service]
         *     responses:
         *       200:
         *         description: The services
         *       405:
         *         description: Error
         */
        this.router.get('', this.controller.getServices);

        /**
         * @swagger
         * /service/{id}:
         *   get:
         *     summary: Get a detail of a service
         *     tags: [Service]
         *     parameters:
         *       - in: path
         *         name: id
         *         schema:
         *           type: string
         *         required: true
         *         description: The service id
         *     responses:
         *       200:
         *         description: The service
         *       405:
         *         description: Error
         */
        this.router.get('/:id', this.controller.getService);

        /**
         * @swagger
         * /service/{id}:
         *   post:
         *     summary: set a price of a service
         *     tags: [Service]
         *     parameters:
         *       - in: path
         *         name: id
         *         schema:
         *           type: string
         *         required: true
         *         description: The service id
         *     requestBody:
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/PriceInput'
         *     responses:
         *       200:
         *         description: The service
         *       405:
         *         description: Error
         */
        this.router.post('/:id', this.controller.getService);
    }
}

const ServiceRoutes = new ServiceRouter().router;
export default ServiceRoutes