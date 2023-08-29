const { ValidationId } = require("../errors/validationError");

const validationId = ({params}, res, next) => {
    const id = Object.values(params)
    if(!id[0]) throw new ValidationId("id is required")
    if(id[0].length !== 36) throw new ValidationId("invalid id")
    next();
}
module.exports = {validationId}