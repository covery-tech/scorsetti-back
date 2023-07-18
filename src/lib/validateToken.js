const jwt = require("jsonwebtoken")


const tokenValidation = (req, res, next)=>{
    const token = req.header("token")
    if(!token) return res.status(401).json("Access denied")
    const payload = jwt.verify(token,process.env.SECRETTOKEN) 
    req.user = {
        email : payload.email,
        name: payload.name,
        id: payload.id,
        type:payload.type
    }
    next()
}
module.exports = {
    tokenValidation
}