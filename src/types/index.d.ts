import { Express } from "express-serve-static-core";

declare module "express-serve-static-core" {
  interface Request {
    patient?: {
      id: string;
      uuid: string;
      username: string;
      display: string;
    };
  }
}
