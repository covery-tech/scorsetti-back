const { ValidationId } = require("../errors/validationError");

const validationId = (req, res, next) => {
    const id = Object.values(req.params)
    if(!id[0]) throw new ValidationId("id is required",req.route)
    if(id[0].length !== 36) throw new ValidationId("invalid id",req.route)
    next();
}
module.exports = {validationId}