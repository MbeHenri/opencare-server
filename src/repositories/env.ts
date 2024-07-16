import { SECURE } from "src/config";
import { base64 } from "../utils";

// O3 env variables
const O3_USER = process.env.O3_USER;
const O3_PASSWORD = process.env.O3_PASSWORD;
const O3_PORT = process.env.O3_PORT;
const O3_HOST = process.env.O3_HOST;

export const BASE_SECURE = `http${SECURE ? 's' : ''}`;

export const O3_BASE_URL = `${BASE_SECURE}://${O3_HOST}${O3_PORT ? `:${O3_PORT}` : ""}/openmrs/ws/rest/v1`;
export const O3_BASEF_URL = `${BASE_SECURE}://${O3_HOST}${O3_PORT ? `:${O3_PORT}` : ""}/openmrs/ws/fhir2/R4`;
export const O3_BASE64 = base64(`${O3_USER}:${O3_PASSWORD}`);

// Talk env variables
export const TALK_USER = process.env.TALK_USER;
export const TALK_PASSWORD = process.env.TALK_PASSWORD;
export const TALK_PORT = process.env.TALK_PORT;
export const TALK_HOST = process.env.TALK_HOST;

export const TALK_BASE64 = base64(`${TALK_USER}:${TALK_PASSWORD}`);

export const TALK_URL = `${BASE_SECURE}://${TALK_HOST}${TALK_PORT ? `:${TALK_PORT}` : ""}`
export const NC_BASE_URL = `${BASE_SECURE}://${TALK_HOST}${TALK_PORT ? `:${TALK_PORT}` : ""}/ocs/v2.php`
export const TALK_BASE_URL = `${NC_BASE_URL}/apps/spreed/api/v4`;

export const TALK_BASE_PASSWORD = process.env.TALK_INIT_PASSWORD;

//Odoo env variables
export const ODOO_PASSWORD = process.env.ODOO_API_KEY;
export const ODOO_USER = process.env.ODOO_USER;
export const ODOO_HOST = process.env.ODOO_HOST;
export const ODOO_PORT = process.env.ODOO_PORT;
export const ODOO_CASH_ID = process.env.ODOO_CASH_ID ? parseInt(process.env.ODOO_CASH_ID) : 7;
export const ODOO_DB = process.env.ODOO_DB;
export const CODE_SERVICE = process.env.ODOO_CODE_SERVICE ? process.env.ODOO_CODE_SERVICE : "OPENCARES";
export const ODOO_BANK_ID = process.env.ODOO_BANK_ID ? parseInt(process.env.ODOO_BANK_ID) : 6;


export const ODOO_BASE_URL = `http://${ODOO_HOST}${ODOO_PORT ? `:${ODOO_PORT}` : ""}`;
