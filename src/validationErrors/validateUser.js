const { ValidationError } = require("../errors/validationError");

const validationLogin = ({body}, res, next) => {
    if(!body.email) throw new ValidationError("email is required")
    if(!body.password) throw new ValidationError("password is required")
    console.log(body.password)
    next();
}
module.exports = {validationLogin}