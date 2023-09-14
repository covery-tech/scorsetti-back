const responseError = (res,statusCode,message,path) => {
    res.status(statusCode).json({
        error:true,
        message,
        path
    })
} 
module.exports = {responseError}