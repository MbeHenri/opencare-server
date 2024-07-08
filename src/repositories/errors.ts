
export class BadResponse extends Error {
    constructor(message: string = "", name: string = "") {
        super(message);
        const tabname = ["BAD-RESPONSE"]
        if (name != "") {
            tabname.push(name)
        }
        this.name = tabname.join("-")
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}