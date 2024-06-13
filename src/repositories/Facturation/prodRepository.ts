import { Service } from "../../models/Service";
import { CODE_SERVICE, ODOO_BANK_ID, ODOO_BASE_URL, ODOO_CASH_ID, ODOO_DB, ODOO_PASSWORD } from "../env";
import { BadResponse } from "../errors";
import { odoo } from "./odoo";
import FacturationRepository, { Type_payement } from "./repository";


class ProdFacturationRepository extends FacturationRepository {

    async getService(service_id: string): Promise<any> {

        const res: any = await odoo.execute_kw(
            'product.template',
            'search_read', [
            [[['barcode', '=', `${CODE_SERVICE}#${service_id}`]]],
            { "fields": ["list_price", "default_code", "name", "barcode"], 'limit': 1 }
        ])
        if (!res) {
            throw new BadResponse("service don't exist")
        }
        try {
            const el = res[0]
            const service: Service = {
                uuid: service_id,
                name: el.name,
                price: el.list_price
            }
            return service
        } catch (error) {
            throw new BadResponse("service don't exist")
        }
    }

    async getPatient(code_patient: string): Promise<any> {

        const res: any = await odoo.execute_kw(
            'res.partner',
            'search_read',
            [
                [[["ref", "=", code_patient]]],
                { "fields": ["id", "name", "email"], 'limit': 1 }
            ]
        )
        try {
            return res[0]
        } catch (error) {
            throw new BadResponse("patient don't exist")
        }
    }

    async setPriceService(service_id: string, price: number): Promise<void> {

        const res: any = await odoo.execute_kw(
            'product.template',
            'write',
            [
                [[['barcode', '=', `${CODE_SERVICE}#${service_id}`]]]
            ])
        if (!res) {
            throw new BadResponse("service don't exist")
        }
        await await odoo.execute_kw('product.template', 'write', [[[res], { 'list_price': price }]])
    }

    async getServices(): Promise<Array<Service>> {

        const res: any = await odoo.execute_kw(
            'product.template',
            'search_read',
            [
                [[['barcode', 'ilike', `${CODE_SERVICE}#%`]]],
                { "fields": ["list_price", "default_code", "name", "barcode"] }
            ])

        if (!res) {
            return []
        }
        return (res as Array<any>).map((el) => {

            const service: Service = {
                uuid: `${el.barcode}`.split("#")[1],
                name: el.name,
                price: el.list_price
            }
            return service
        })
    }

    async createInvoice(code_patient: string, service_ids: Array<string>): Promise<string> {
        const res: any = await odoo.execute_kw(
            'product.product',
            'search_read',
            [
                [[[
                    'barcode',
                    'in',
                    service_ids.map((service_id) => {
                        return `${CODE_SERVICE}#${service_id}`
                    })
                ]]],
                { 'fields': ['id', 'list_price'] }
            ])

        /* const product_lines_ids = (res as Array<any>).map((product) => {
            return [0, 0, {
                'product_id': product['id'],
                'quantity': 1,
                'price_unit': product['list_price'],
            }]
        }) */

        const invoice_id: any = await odoo.execute_kw(
            'account.move',
            'create',
            [
                [{
                    'move_type': 'out_invoice',
                    //'invoice_line_ids': product_lines_ids,
                    'partner_id': (await this.getPatient(code_patient))["id"],
                }]
            ])

        const product_lines = (res as Array<any>).map((product) => {
            return {
                'move_id': invoice_id,
                'product_id': product['id'],
                'quantity': 1,
                'price_unit': product['list_price'],
            }
        })

        for (let i = 0; i < product_lines.length; i++) {
            await odoo.execute_kw('account.move.line', 'create', [[product_lines[i]]])
        }

        await odoo.execute_kw('account.move', 'action_post', [[invoice_id]])
        return invoice_id;
    }

    async getInvoiceFile(invoice_id: string): Promise<any> {

        let res: any = await odoo.execute_kw('account.move', 'search_read',
            [
                [[[
                    'id',
                    '=',
                    invoice_id
                ]]],
                { 'fields': ['access_token'], 'limit': 1 }
            ])
        res = res as Array<any>
        if (res.length == 0) {
            throw new BadResponse("invoice don't exist");
        }
        res = res[0]
        res = await fetch(
            `${ODOO_BASE_URL}/my/invoices/${invoice_id}?report_type=pdf&download=true&access_token=${res['access_token']}`
            , { method: 'GET', }
        )
            .then(response => {
                if (response.ok) {
                    return response.blob()
                    /* 
                    return response.body
                     */
                }
                throw new BadResponse()
            })
            .then(data => data.arrayBuffer()).then(data => Buffer.from(data))
        return res
    }

    async payInvoice(invoice_id: string, type_payement: Type_payement = "Cash"): Promise<void> {

        let invoice: any = await this.getInvoice(invoice_id);

        if (invoice.amount_residual > 0) {

            // ajout d'un paiement 
            const amount: number = invoice['amount_residual']
            const id_type_payement = type_payement == "Bank" ? ODOO_BANK_ID : ODOO_CASH_ID
            const customer_id = invoice['partner_id'][0];
            await this.addPayment(customer_id, amount, id_type_payement);

            // jointure du premier paiement non utilisé du client à la facture du client 
            invoice = await odoo.execute_kw(
                'account.move',
                'search_read',
                [
                    [[[
                        'id',
                        '=',
                        invoice_id
                    ]]],
                    { 'fields': ['invoice_outstanding_credits_debits_widget'], 'limit': 1 }
                ]) as Array<any>;

            try {
                const payment_credit_id = invoice[0]['invoice_outstanding_credits_debits_widget']['content'][0]['id']
                await odoo.execute_kw(
                    'account.move', 'js_assign_outstanding_line',
                    [[parseInt(invoice_id), payment_credit_id]]
                )
            } catch (error) { }
        }
    }

    private async addPayment(customer_id: any, amount: number, id_type_payement: number) {
        const payment_data = {
            'payment_type': 'inbound',
            'partner_type': 'customer',
            'partner_id': customer_id,
            'amount': amount,
            'journal_id': id_type_payement,
        };

        // Valider le paiement de la facture
        const payment_id = await odoo.execute_kw('account.payment', 'create', [[payment_data]]);

        try {
            await odoo.execute_kw(
                'account.payment', 'action_post',
                [[payment_id]]
            );
        } catch (error) { }
    }

    async getInvoice(invoice_id: string): Promise<any> {
        const invoice: any = await odoo.execute_kw(
            'account.move',
            'search_read',
            [
                [[[
                    'id',
                    '=',
                    invoice_id
                ]]],
                { 'fields': ['id', 'partner_id', 'amount_total', 'amount_residual', 'currency_id', 'payment_state', 'date'], 'limit': 1 }
            ]);

        try {
            return invoice[0];
        } catch (error) {
            throw new BadResponse("invoice don't exist");
        }
    }

    async getInvoices(code_patient: string): Promise<Array<any>> {

        const patient = await this.getPatient(code_patient)
        const invoices: any = await odoo.execute_kw(
            'account.move',
            'search_read',
            [
                [[[
                    'partner_id',
                    '=',
                    patient['id']
                ]]],
                { 'fields': ['id', 'amount_total', 'payment_state', 'date', 'amount_residual'] }
            ]);

        if (!invoices) {
            throw new BadResponse("invoices don't exist");
        }
        return invoices;
    }
}

export default ProdFacturationRepository