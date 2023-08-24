const {conn} = require("../config/connection")
const sharp = require("sharp")
const fs = require("fs")
const helperImg = (filePath,filename,size = 300)=>{
    return sharp(filePath)
        .resize(size)
        .toFile(`../src/optimize/${filename}`)
}


const img = async(req,res)=>{
    const {file} = req
    const {user} = req
    try{
        if(!file?.path) return res.status(204).send("didn't have image")
        helperImg(file.path,`resize-${file.filename}`,150)
        helperImg(file.path,`large-${file.filename}`,500)
        conn.query(`UPDATE users SET img = "/resize-${file.filename}" where id=${user.id}`,(err,resp)=>{
            if(err) res.status(404).json({err,hi:"hola"})
            res.status(200).send("img load")
        })
    }catch(e){
        res.status(400).send(e)
    }
} 


// const getImg = (req,res)=>{
//     const {user} = req
//     const query = `select img form users where id = ${user.id}`
//     try{
//         conn.query()
//     }

// }


module.exports = {
    img,
    // getImg
}