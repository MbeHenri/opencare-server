import { config } from 'dotenv';
config();

export const SECURE = process.env.SECURE ? process.env.SECURE != "false" : true

const SSL_KEY_PATH = process.env.SSL_KEY_PATH;
const SSL_CERT_PATH = process.env.SSL_CERT_PATH;

//export const dbURI = `mongodb://${(MONGO_USER && MONGO_PASSWORD) ? `${MONGO_USER}:${MONGO_PASSWORD}@` : ""}${MONGO_HOST}${MONGO_PORT ? `:${MONGO_PORT}` : ":27017"}/opencare?authSource=admin`;
export const dbURI = `${process.env.MONGO_URL}`;
export const CORS_ALLOW_HOSTS = process.env.CORS_ALLOW_HOSTS ? process.env.CORS_ALLOW_HOSTS.split(" ") : "*"
export const port = process.env.SERVER_PORT ? parseInt(process.env.SERVER_PORT) : 3001;
export const key_token = process.env.KEY_TOKEN ? process.env.KEY_TOKEN : '';
export const KEY_PATH = SSL_KEY_PATH ? SSL_KEY_PATH : '';
export const CERT_PATH = SSL_CERT_PATH ? SSL_CERT_PATH : '';
export const BASE_LINKROOM_TALK = process.env.BASE_LINKROOM_TALK ? process.env.BASE_LINKROOM_TALK : "/talk"
