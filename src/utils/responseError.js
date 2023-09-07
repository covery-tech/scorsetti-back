const responseError = (res,statusCode=404,message,path) => {
    res.status(statusCode).json({
        error:true,
        message,
        path
    })
} 
module.exports = {responseError}