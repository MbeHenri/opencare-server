
import { Service } from "../../models/Service";
import { CODE_SERVICE } from "../env";
import { BadResponse } from "../errors";
import { odoo } from "./odoo";
import FacturationRepository from "./repository";


class ProdFacturationRepository extends FacturationRepository {

    async getService(service_id: string): Promise<any> {

        const res: any = await odoo.execute_kw(
            'product.template',
            'search_read', [
            [[['barcode', '=', `${CODE_SERVICE}#${service_id}`]]],
            { "fields": ["list_price", "default_code", "name", "barcode"] }
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

}

export default ProdFacturationRepository