const { ValidationError } = require("../errors/validationError");

const validationLogin = ({body}, res, next) => {
    if(!body.email) throw new ValidationError("email is required")
    if(!body.password) throw new ValidationError("password is required")
    next();
}

const validateRegister = ({body}, res, next) => {
    if(!body.email) throw new ValidationError("email is required")
    if(!body.password) throw new ValidationError("password is required")
    if(!body.date) throw new ValidationError("date is required")
    if(!body.lastName) throw new ValidationError("lastName is required")
    if(!body.name) throw new ValidationError("name is required")
    next();
}
module.exports = {validationLogin,validateRegister}