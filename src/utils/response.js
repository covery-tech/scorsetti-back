const response = (res,statusCode = 200,data) => {
    console.log(statusCode)
    res.status(statusCode).json({
        error:false,
        data
    })
} 
module.exports = {response}