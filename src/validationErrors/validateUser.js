const { ValidationError } = require("../errors/validationError");

const validationLogin = (req, res, next) => {
    if(!req.body.email) throw new ValidationError("email is required",404,`${req.route.path}`)
    if(!req.body.password) throw new ValidationError("password is required",404,`${req.route.path}`)
    next();
}

const validateRegister = (req, res, next) => {
    if(!req.body.email) throw new ValidationError("email is required",404,`${req.route.path}`)
    if(!req.body.password) throw new ValidationError("password is required",404,`${req.route.path}`)
    if(!req.body.date) throw new ValidationError("date is required",404,`${req.route.path}`)
    if(!req.body.lastName) throw new ValidationError("lastName is required",404,`${req.route.path}`)
    if(!req.body.name) throw new ValidationError("name is required",404,`${req.route.path}`)
    next();
}
module.exports = {validationLogin,validateRegister}