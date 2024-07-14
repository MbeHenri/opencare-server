import { Service } from "../../models/Service";

export type Type_payement = "Cash" | "Bank";

class FacturationRepository {

    async getService(service_id: string): Promise<any> {
        return {}
    }

    async getPatient(code_patient: string): Promise<any> {

    }

    async setPriceService(service_id: string, price: number): Promise<void> {

    }

    async getServices(): Promise<Array<Service>> {
        return []
    }

    async createInvoice(code_patient: string, service_ids: Array<string>): Promise<string> {
        return "";
    }

    async getInvoiceFile(invoice_id: string): Promise<any> {
        return "";
    }

    async payInvoice(invoice_id: string, type_payement: Type_payement = "Cash"): Promise<void> {
    }


    async getInvoice(invoice_id: string): Promise<any> {
        return {}
    }

    async getInvoices(code_patient: string): Promise<Array<any>> {
        return [];
    }
}

export default FacturationRepository;