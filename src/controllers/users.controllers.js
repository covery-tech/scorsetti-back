const conn = require("../config/connection")
const jwt = require("jsonwebtoken");
const { validateUserType } = require("../lib/validateUserType");
require('dotenv').config();

const register = (req,res)=>{
    const {name,lastName,date,password,email} = req.body
    const querySearchUserSQL = `SELECT * FROM personal_data WHERE email = '${email}'`
    const queryIntroSQL = `INSERT INTO users (status) VALUES (1)`
    try{
        if(name.length || lastName.length || date.length || password.length || email.length){
        conn.query(querySearchUserSQL, function(err,result2){
            if(err) res.status(400).send(err)
            if(!result2.length){
                conn.query(queryIntroSQL,(err2,results)=>{
                    const queryInsertType =`INSERT INTO type_user (id_user,type) VALUES (${results.insertId},"client")`
                    const queryInsertPersonalData =`INSERT INTO personal_data ( name, last_name, date, password, email,id_user) VALUES ("${name}", "${lastName}", "${date}", "${password}", "${email}",${results.insertId})`
                    const queryInserLocation =`INSERT INTO location (users_id) VALUES (${results.insertId})`
                    conn.query(queryInsertType)
                    conn.query(queryInsertPersonalData)
                    conn.query(queryInserLocation)
                    res.status(200).send(true)
                })

            }else{
                res.status(201).send("this email is used")
            }
        })}else{
            res.status(202).send("missing data")
        }
    }catch(e){
        res.status(400).send(e)
    }
}

const postLogin = async (req, res)=>{
    const {email, password } = req.body
    //(password)
    const querySearchUserSQL = `SELECT * FROM personal_data WHERE email = '${email}'`
    try{
        conn.query(querySearchUserSQL,async function(err,result){
            if(err) res.status(400).send(err)
            const passwordCorrect = result[0]?.password === password
            if(!(result[0] && passwordCorrect)){
                res.status(401).send("invalid user or password")
            }else{
            const {name,id_user,email} = result[0]
            const querySearchUserSQL = `SELECT type FROM type_user WHERE id_user = ${id_user}`
            let type
            conn.query(querySearchUserSQL,(err2,results)=> {
                type=results[0].type
            
            // //(type)
            const userForToken = {
                id:id_user,
                name,
                email,
                type
            }
            const data ={
                ...result[0],
                type
            }
            //(data)
            const token = jwt.sign(userForToken, process.env.SECRETTOKEN)
            res.header("token", token).status(200).json({
                result:data,
                token
            })
        })}
        })
    }catch(e){
        res.status(400).send(e)
    }
}

const getImage=(req,res)=>{
    const {user} = req
    conn.query(`select img from users where id = '${user.id}'`,(err,resp)=>{
        if(err) res.status(404).send(err)
        else {
            //(resp[0].img)
            //()
            res.status(200).send(resp[0].img)
        }
    })
}


const getImageLarge=(req,res)=>{
    const {userId} = req.params
    conn.query(`select img from users where id = '${userId}'`,(err,resp)=>{
        if(err) res.status(400).send(err)
        else {
            if(resp[0]?.img){
            const image = `/large-${resp[0].img.split("-")[1]}`
            res.status(200).send(image)
        }
        else{
            res.status(201).send(resp[0])
        }
        }
    })
}


const getUserById = (req,res)=>{
    const {idUser} = req.params
    const querySearchId = `SELECT * FROM users WHERE id = '${idUser}'`
    try{
        conn.query(querySearchId,function(err,result){
            if(err) res.status(400).send(err)
            else{
                res.status(200).send(result)
            }
        })
    }catch(e){
        res.status(400).send(e)
    }
}

const getPasById = (req,res)=>{
    const {idUser} = req.params
    const queryTypePas = `SELECT * from type_user where id_user = '${idUser}'`
    const querySearchId = `SELECT location.*, personal_data.*,type_user.type, users.img ,users.description, type_user.status_pas FROM users join personal_data JOIN type_user JOIN location ON location.users_id = personal_data.id_user AND users.id = personal_data.id_user AND personal_data.id_user=type_user.id_user WHERE location.users_id = ${idUser}`
    try{
        conn.query(queryTypePas,function(error,response){
            if(error) return res.status(400).send(error)
            
            if(response.length){
                conn.query(querySearchId,function(err,result){
                    if(err) res.status(400).send(err)
                    else{
                        let coords
                        //(result[0].type)
                        if(result[0].type !== "pas") return res.status(201).send("This user is not pas")
                        if(result.length && result[0].status_pas && result[0].type === "pas"){
                        coords = JSON.parse(result[0]?.coords)
                        const pas = {
                            calle:result[0].street_name,
                            coords,
                            cuit:result[0].cuit,
                            date:result[0].date,
                            depto:result[0].depto,
                            dni:result[0].dni,
                            email:result[0].email,
                            phone_number:result[0].phone_number,
                            postal_code:result[0].postal_code,
                            type:result[0].type,
                            id:result[0].id,
                            name:result[0].name,
                            last_name:result[0].last_name,
                            location:result[0].city,
                            description:result[0].description
                        }
                        return res.status(200).send(pas)
                    }else{
                        return res.status(202).send("This user is not enabled")
                    }
                    }
                })
            }else return res.status(201).send("This user is not pas")
})
    }catch(e){
        res.status(400).send(e)
    }
}


const updateTypeUser = (req,res)=>{
    const {type,idUser} = req.params
    const {user} = req
    const validate = validateUserType(user.type)
    const queryUpdateSQL = `UPDATE type_user SET type = "${type}" WHERE id_user = '${idUser}';`
    const querySearchRegister = `SELECT * FROM products_users WHERE users_id='${idUser}';` 
    try{
        if( validate ){
        conn.query(queryUpdateSQL,function(err,result){
            if(err) res.status(400).send(err) 
            else{
                conn.query(querySearchRegister,function(err2,result2){
                    if(err2) res.status(400).send(err2) 
                    else if(!result2.length){
                        conn.query(`INSERT INTO 
                        products_users 
                        (users_id) 
                        VALUES ('${idUser}')`)
                        res.status(200).send(true)
                    }
                    else res.status(200).send(true)
                })
            }
        })
    }
    else{res.status(403).send("Access Denied")}
    }catch(e){
        res.status(400).send(e)
    }
}





const getPasUser = (req, res) => {
    const {page} = req.params
    const number = parseInt(page);
    const query = `SELECT type_user.*, personal_data.*  FROM type_user JOIN personal_data on type_user.id_user = personal_data.id_user WHERE type = "pas" LIMIT ${(number - 1) * 7}, 7;`
    try {
        conn.query(query, (err, result) => {
            if (err) {
                res.status(400).send(err)
            } 
            else {
                    res.status(200).send(result)
            }
        })
    } 
    catch (e) {
        res.status(400).send(e)
    }
}

const getAllUsers = (req, res) => {
    const {page} = req.params
    const number = parseInt(page);
    const query = `SELECT type_user.*, personal_data.*  FROM type_user JOIN personal_data on type_user.id_user = personal_data.id_user WHERE type = "client" OR type = "pas" OR type = "admin" LIMIT ${(number - 1) * 7}, 7;`
    try {
        conn.query(query, (err, result) => {
            if (err) {
                res.status(400).send(err)
            } 
            else {
                    res.status(200).send(result)
            }
        })
    } 
    catch (e) {
        res.status(400).send(e)
    }
}



const getStatusPas = (req,res)=>{
    const {estatus,idUser} = req.params
    const {user} = req
    const validate = validateUserType(user.type)
    const queryUpdateSQL = `UPDATE type_user SET status_pas = "${estatus}" WHERE id_user = '${idUser}' ;`
    try{
        if(validate){
        conn.query(queryUpdateSQL,function(err,result){
            if(err) res.status(400).send(err)
            else{
                res.status(200).send(true)
            }
        })}
        else{res.status(403).send("Access Denied")}
    }catch(e){
        res.status(400).send(e)
    }
}

const searchUserByEmail = (req,res)=>{
    const {email} = req.params
    const {user} = req
    const validate = validateUserType(user.type)
    const querySearchUser = `SELECT personal_data.*,type_user.type FROM personal_data join type_user on personal_data.id_user = type_user.id_user WHERE email LIKE "%${email || ""}%" and type in ("client", "pas","admin")`
    try{
        if(validate){
            conn.query(querySearchUser,function(err,result){
            if(err) res.status(500).send(err)
            else{
                res.status(200).send(result)
            }
        })
    }
    else{res.status(403).send("Access Denied")}
    }catch(e){
        res.status(400).send(e)
    }
}


const myPersonalData = (req,res)=>{
    const {user} = req
    const location = `select location.* , personal_data.password, users.img,users.description, personal_data.phone_number from location join personal_data join users where location.users_id ='${user.id}' AND personal_data.id_user='${user.id}' AND users.id ='${user.id}'`
    try{
                conn.query(location,(error, e)=>{
                    if(error) res.status(400).send(error)
                    else{
                        //(e[0])
                        let coords;
                        user.type ==="pas" ? coords = JSON.parse(e[0]?.coords) : coords
                        //(coords)
                        const data = {
                            city:e[0].city,
                            image:e[0]?.img,
                            coords:`${coords?.long},${coords?.lat}`,
                            password:e[0].password,
                            postal_code:e[0].postal_code,
                            phone_number:e[0].phone_number,
                            province:e[0].province,
                            street_name:e[0].street_name,
                            description:e[0].description,
                            type:user.type,
                        }
                        res.status(200).send(data) 
                    }
        })
    }catch(e){
        res.status(400).send(e)
    }
}

const updateUserInfo = (req,res)=>{
    const {users} = req.body
    const {user} = req

    const upadatePersonalData = `UPDATE personal_data SET phone_number = "${users.phone_number || ""}" WHERE id_user = '${user.id}'`
    let coord = users.coords.split(",")
    coord = {
        long:coord[0],
        lat:coord[1]
    }
    coord = JSON.stringify(coord) 
    //(coord)
    const updateRoute = `UPDATE personal_data SET route = '${users.route}' WHERE id = '${user.id}'`;
    const updateCoords = `UPDATE location SET coords = '${coord || ""}' , street_name = "${users.street_name || ""}" , city = "${users.city || ""}" , province = "${users.province || ""}", postal_code = "${users.postal_code || ""}" WHERE users_id = '${user.id}';`
    const updateUser = `UPDATE users SET description = '${users.description}' where id = '${user.id}'`
    try{
        conn.query(upadatePersonalData)
        conn.query(updateCoords)
        conn.query(updateRoute)
        conn.query(updateUser)
        res.status(200).send(true)
    }catch(e){
        res.status(400).send(e)
    }
}

const getClientsOfPas = (req,res)=>{
    const {idPas} = req.params
    //(idPas)
    const searchClientsPas = `select * from orders where pas_id = '${idPas}' AND status_payment ='authorized'`
    try{
        conn.query(searchClientsPas,function(err,resp){
            if(err) return res.status(500).send("an error occurred")
            else{
                return res.status(200).send(resp)
            }
        })
    }catch(error){
        return res.status(400).send("server error")
    }
}

const getAllRoutes = (req, res) => {    
    const getRoutes = `SELECT route FROM personal_data where id_user = '${req.params.id}'`;
    try {
        conn.query(getRoutes, function(err, resp){
            if (err) return res.status(500).send("an error occurred");
            else {
                return res.status(200).send(resp[0]);
            }
        })
    } catch (error) {
        return res.status(400).send("server error");
    }
}


module.exports = {
    register,
    postLogin,
    getUserById,
    updateTypeUser,
    getPasUser,
    getStatusPas,
    searchUserByEmail,
    getPasById,
    getImage,
    myPersonalData,
    updateUserInfo,
    getImageLarge,
    getClientsOfPas,
    getAllUsers,
    getAllRoutes
}