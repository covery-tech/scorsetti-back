const conn = require("../config/connection")
const axios = require("axios")
const createForm = (req,res)=>{
    const {form} = req.body
    const {user} = req
    const validate = validateUserType(user.type)
    const queryIntroSQL = `INSERT INTO forms (info_form) VALUES ('${form}');`
    try{
        if(validate){
        conn.query(queryIntroSQL,(err,res)=>{
            if(err) throw err
            else{
                
                res.status(200).send(true)
            }
        })}
        else{res.status(403).send("Access Denied")}
    }catch(e){
        res.status(400).send(e)
    }
}

const editForm = (req,res)=>{
    const {form,id} = req.body
    const {user} = req
    const queryUpdateSQL = `UPDATE forms SET info_form = '${form}' WHERE forms.id = ${id};`
    try{
        if(user.type=="admin" || user.type=="superadmin" || user.type=="pas"){
        conn.query(queryUpdateSQL,function(err,result){
            if(err) throw err
            else{
                //(result)
                res.status(200).send(true)
            }
        })}else{
            res.status(403).send("Access Denied")
        }
    }catch(e){
        res.status(400).send(e)
    }
}

const deleteForm = (req,res)=>{
    const {id} = req.body
    const queryDeleteSQL = `DELETE FROM forms WHERE forms.id =${id} ` 
    try{
        conn.query(queryDeleteSQL,function(err,result){
            if(err) throw err
            else{
                //(result)
                res.status(200).send(true)
            }
        })
    }catch(e){
        res.status(400).send(e)
    }
}

const getFormById = (req,res)=>{
    const {formId} = req.params
    //(formId)
    const querySearchId = `SELECT * FROM forms WHERE id = ${formId}`
    try{
        conn.query(querySearchId,function(err,result){
            if(err) throw err
            else{
                let data = JSON.parse(result[0].info_form)

                const info = {
                    id:result[0].id,
                    image:data.image,
                    product_title: data.productTitle || data.product_title,
                    struct: data.inputs
                }
                res.status(200).send(info)
            }
        })
    }catch(e){
        res.status(400).send(e)
    }
}


const tokenLibra = (req,res)=>{
    //(req.body)
    //(req.body.password)
    const formData = 
    {
        grant_type:"password",
        username:"GHERNANDEZ",
        password:"Hernandez@2023",
    }
    const config = {
        method: "POST",
        baseURL: `http://uat.libraseguros.com.ar/Sise3GBELibraCoreUatWebApi/token`,
        data:req.body
    }
    axios(config).then(e=>{
        //(e.data)
    }).catch(e=>{
        //(e)
    })
    res.status(200).send("ok")
}


module.exports = {
    createForm,
    editForm,
    getFormById,
    deleteForm,
    tokenLibra
}