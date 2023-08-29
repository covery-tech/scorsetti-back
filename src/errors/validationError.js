const CreateErrorFactory = function (name) {
    return class BussinessError extends Error {
        constructor(message) {
            super(message)
            this.name = name;
        }
    }
}

const ValidationError = CreateErrorFactory("ValidationError")
const ValidationId = CreateErrorFactory("ValidationId")

module.exports = {ValidationError,ValidationId}