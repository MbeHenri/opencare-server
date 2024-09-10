import { base64 } from "../utils";

// O3 env variables
const O3_USER = process.env.O3_USER;
const O3_PASSWORD = process.env.O3_PASSWORD;
const O3_URL = process.env.O3_URL;

export const O3_BASE_URL = `${O3_URL}/openmrs/ws/rest/v1`;
export const O3_BASEF_URL = `${O3_URL}/openmrs/ws/fhir2/R4`;
export const O3_BASE64 = base64(`${O3_USER}:${O3_PASSWORD}`);

// Talk env variables
const TALK_USER = process.env.TALK_USER;
const TALK_PASSWORD = process.env.TALK_PASSWORD;
const TALK_URL = process.env.TALK_URL;

export const TALK_BASE64 = base64(`${TALK_USER}:${TALK_PASSWORD}`);
export const NC_BASE_URL = `${TALK_URL}/ocs/v2.php`
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
