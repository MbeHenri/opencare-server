
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
            [[['barcode', '=', service_id]]],
            { "fields": ["list_price", "default_code", "name", "barcode"] }
        ])
        if (!res) {
            throw new BadResponse("service don't exist")
        }
        const el = res[0]
        const service: Service = {
            uuid: el.barcode,
            name: el.name,
            price: el.list_price
        }
        return service
    }

    async setPriceService(service_id: string, price: number): Promise<void> {

        const res: any = await odoo.execute_kw(
            'product.template',
            'write',
            [
                [[['barcode', "=", service_id]]]
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
                [[['default_code', 'ilike', `${CODE_SERVICE}%`]]],
                { "fields": ["list_price", "default_code", "name", "barcode"] }
            ])
        if (!res) {
            return []
        }
        return (res as Array<any>).map((el) => {
            const service: Service = {
                uuid: el.barcode,
                name: el.name,
                price: el.list_price
            }
            return service
        })
    }

}

export default ProdFacturationRepository