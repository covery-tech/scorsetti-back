class ValidationError extends Error {
    constructor(message) {
        super(message)
        this.name = "ValidationError";
    }
}
class ValidationId extends Error {
    constructor(message) {
        super(message)
        this.name = "ValidationId";
    }
}
module.exports = {ValidationError,ValidationId}