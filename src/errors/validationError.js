const CreateErrorFactory = function (name) {
    return class BussinessError extends Error {
        constructor(message,route,status) {
            super(message)
            this.name = name;
            this.url = route;
            this.status = status
        }
    }
}

class ValidationError extends Error {
    constructor(message, status = 400, route) {
        super(message)
        this.name = "ValidationError";
        this.message = message;
        this.url = route;
        this.status = status;
        this.stack = "ValidationError"
    }
}

const ValidationId = CreateErrorFactory("ValidationId")

module.exports = {ValidationError,ValidationId}