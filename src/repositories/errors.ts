
export class BadResponse extends Error {
    constructor(message: string = "") {
        super(message);
    }
}