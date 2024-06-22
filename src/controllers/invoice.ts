import { Request, Response } from "express";
import { facturation_rep,/* hospital_rep, room_rep*/ } from "../repositories";

class InvoiceController {

    /* async createInvoice(req: Request, res: Response) {
        try {
            const { patient_id, services } = req.body

            const patient = await PatientModel.findOne({ uuid: patient_id })
            if (!patient) {
                throw new Error("patient don't exist");
            }

            const invoice_id = await facturation_rep.createInvoice(patient.username, services as Array<string>)
            const invoice = await facturation_rep.getInvoice(invoice_id)

            res.status(200).json({ date: invoice.date, state: invoice.payment_state, currency: invoice.currency_id[1], amount_total: invoice.amount_total, amount_residual: invoice.amount_residual });
        } catch (error) {
            res.status(405).json({ message: error });
        }
    } */

    async getInvoice(req: Request, res: Response) {
        try {
            const invoice_id = req.params.id

            const invoice = await facturation_rep.getInvoice(invoice_id)
            res.status(200).json({ date: invoice.date, state: invoice.payment_state, currency: invoice.currency_id[1], amount_total: invoice.amount_total, amount_residual: invoice.amount_residual });
        } catch (error) {
            res.status(405).json({ message: error });
        }
    }

    async getInvoicePdf(req: Request, res: Response) {
        try {
            const invoice_id = req.params.id

            const invoicefile = await facturation_rep.getInvoiceFile(invoice_id)
            res.status(200).send(invoicefile);
        } catch (error) {
            res.status(405).json({ message: error });
        }
    }

    /* async setInvoiceToPay(req: Request, res: Response) {
        try {
            const invoice_id = req.params.id

            await facturation_rep.payInvoice(invoice_id)
            const invoice = await facturation_rep.getInvoice(invoice_id)

            res.status(200).send({ date: invoice.date, state: invoice.payment_state, currency: invoice.currency_id[1], amount_total: invoice.amount_total });
        } catch (error) {
            res.status(405).json({ message: error });
        }
    } */

}

export default InvoiceController;
