import { Service } from "../../models/Service";

class FacturationRepository {

    async getService(service_id: string): Promise<any> {
        return
    }

    async setPriceService(service_id: string, price: number): Promise<void> {
    }

    async getServices(): Promise<Array<Service>> {
        return []
    }

}

export default FacturationRepository;