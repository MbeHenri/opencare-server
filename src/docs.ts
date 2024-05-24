import { port } from "./config";

export const REST_DOCS_OPTIONS = {
    definition: {
        openapi: "3.1.0",
        info: {
            title: "Opencare API",
            version: "0.1.0",
            description:
                "This is a Opencare API documented with Swagger",
            license: {
                name: "MIT",
                //url: "https://spdx.org/licenses/MIT.html",
            },
            contact: {
                name: "Opencare",
                url: "https://opencare.com",
                email: "opencare@email.com",
            },
        },
        servers: [
            {
                url: "http://localhost:" + port,
            },
        ],
    },
    apis: ["src/routes/*.ts"],
};
