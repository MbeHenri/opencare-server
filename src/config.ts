import { config } from 'dotenv';
config();


const MONGO_HOST = process.env.MONGO_HOST;
const MONGO_PORT = process.env.MONGO_PORT;
const MONGO_USER = process.env.MONGO_USER;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;

const SSL_KEY_PATH = process.env.SSL_KEY_PATH;
const SSL_CERT_PATH = process.env.SSL_CERT_PATH;

//export const dbURI = `mongodb://${(MONGO_USER && MONGO_PASSWORD) ? `${MONGO_USER}:${MONGO_PASSWORD}@` : ""}${MONGO_HOST}${MONGO_PORT ? `:${MONGO_PORT}` : ":27017"}/opencare?authSource=admin`;
export const dbURI = `mongodb://${MONGO_HOST}${MONGO_PORT ? `:${MONGO_PORT}` : ":27017"}/opencare`;
export const CORS_ALLOW_HOSTS = process.env.CORS_ALLOW_HOSTS ? process.env.CORS_ALLOW_HOSTS.split(" ") : "*"
export const port = process.env.SERVER_PORT ? parseInt(process.env.SERVER_PORT) : 3001;
export const key_token = process.env.KEY_TOKEN ? process.env.KEY_TOKEN : '';
export const KEY_PATH = SSL_KEY_PATH ? SSL_KEY_PATH : '';
export const CERT_PATH = SSL_CERT_PATH ? SSL_CERT_PATH : '';
