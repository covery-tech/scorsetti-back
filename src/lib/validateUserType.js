const validateUserType = (type)=>{
    if(type=="admin" || type=="superadmin"){
        return true
    }else{
        return false
    }
}
module.exports = {validateUserType}
