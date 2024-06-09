import { createClient, createSecureClient, Client } from "xmlrpc";
import { ODOO_DB, ODOO_HOST, ODOO_PASSWORD, ODOO_PORT, ODOO_USER } from "../env";
import { BadResponse } from "../errors";

export default class Odoo {

    secure: boolean;
    models: Client;
    common: Client;
    uid: any | null = null;

    constructor(secure = false) {
        this.secure = secure
        this.models = this._getClient("/xmlrpc/2/object")
        this.common = this._getClient("/xmlrpc/2/common")
    }

    _getClient(path: string) {
        const createClientFn = this.secure ? createSecureClient : createClient;
        const options = {
            host: ODOO_HOST,
            path,
        }
        if (ODOO_PORT) {
            options["port"] = parseInt(ODOO_PORT)
        }
        return createClientFn(options)
    }


    _methodCall(method: string, params: Array<any> = []) {
        return new Promise((resolve, reject) => {
            this.models.methodCall(method, params, (err, value) => {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(value);
                }
            });
        });
    }

    _authCall() {
        return new Promise((resolve, reject) => {
            this.common.methodCall("authenticate", [
                ODOO_DB,
                ODOO_USER,
                ODOO_PASSWORD,
                {},
            ], (err, value) => {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(value);
                }
            });
        });
    }

    async connect() {
        if (!this.uid) {
            const uid = await this._authCall();
            if (!uid) { throw new BadResponse("Authentication failed"); }
            this.uid = uid;
        }
    }

    async execute_kw(model: string, method: string, params: Array<any> = []) {
        try {

            if (!this.uid) {
                await this.connect()
            }

            const finalParams = [
                ODOO_DB,
                this.uid,
                ODOO_PASSWORD,
                model, method,
                ...params,
            ];
            const value = await this._methodCall("execute_kw", finalParams);
            return value;
        } catch (error) {
            throw new BadResponse(error as string);
        }
    }
}

export const odoo = new Odoo();