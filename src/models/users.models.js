const crypto = require("node:crypto")
const {conn2} = require("../config/connection");
const jwt = require("jsonwebtoken");
const { warn } = require("node:console");
require('dotenv').config();

class UserModels {
    static async register (name,lastName,date,password,email) {
        const querySearchUserSQL = `SELECT * FROM personal_data WHERE email = '${email}'`
        const idUser = crypto.randomUUID()
        const queryIntroSQL = `INSERT INTO users (id,status) VALUES ('${idUser}',1)`
        try{
            if(name.length || lastName.length || date.length || password.length || email.length){
                const [rows] = await conn2.query(querySearchUserSQL)
                if(!rows.length){
                    await conn2.query(queryIntroSQL)
                    const idType = crypto.randomUUID()
                    const idPersonalData = crypto.randomUUID()
                    const idInserLocation = crypto.randomUUID()
                    const queryInsertType =`INSERT INTO type_user (id,id_user,type) VALUES ('${idType}','${idUser}',"client")`
                    const queryInsertPersonalData =`INSERT INTO personal_data (id,name, last_name, date, password, email,id_user) VALUES ('${idPersonalData}',"${name}", "${lastName}", "${date}", "${password}", "${email}",'${idUser}')`
                    const queryInserLocation =`INSERT INTO location (id,users_id) VALUES ('${idInserLocation}','${idUser}')`
                    await conn2.query(queryInsertType)
                    await conn2.query(queryInsertPersonalData)
                    await conn2.query(queryInserLocation)
                    return true;
                } else {
                    return "this email is used";
                }
            }else{
                return "missing data";
            }
        }catch(e){
            return e;
        }
    }
    static async postLogin (email, password ) {
        try{
        const querySearchUserSQL = `SELECT * FROM personal_data WHERE email = '${email}'`
        const [rows] = await conn2.query(querySearchUserSQL)
            const passwordCorrect = rows[0]?.password === password
            if(!(rows[0] && passwordCorrect)){
                return "invalid user or password";
            }else{
            const {name,id_user,email} = rows[0]
            const querySearchUserSQL = `SELECT type FROM type_user WHERE id_user = '${id_user}'`
            let type
            const results = await conn2.query(querySearchUserSQL)
            type=results[0][0].type
            const userForToken = {
                id:id_user,
                name,
                email,
                type
            }
            const data ={
                ...rows[0],
                type
            }
            const token = jwt.sign(userForToken, process.env.SECRETTOKEN)
            return {
                result:data,
                token
            }
        }
    } catch (e) {
        return e;
    }
    }
    static async getImage (userId) {
        const [rows] = await conn2.query(`select img from users where id = '${userId}'`)
        return rows[0].img;
    }
    static async getImageLarge (userId) {
        try{
        const [rows] = await conn2.query(`select img from users where id = '${userId}'`)
        if(rows[0] && rows[0].img) {
            const image = `/large-${rows[0].img.split("-")[1]}`
            return image
        }else {
            return ""
        }
    }catch(e){
        return e;
    }
    }
    static async getUserById (idUser) {
        try{
            const querySearchId = `SELECT * FROM users WHERE id = '${idUser}'`
            const [rows] = await conn2.query(querySearchId)
            return rows
        }catch(e){
            return [];
        }
    }
    static async getPasById (route) {
        try{
            const queryTypePas = `SELECT * from personal_data where route = '${route}'`
            const [rows] = await conn2.query(queryTypePas)
            if(!rows.length) return 201;
            const querySearchId = `SELECT location.*, personal_data.*,type_user.type, users.img ,users.description, type_user.status_pas FROM users join personal_data JOIN type_user JOIN location ON location.users_id = personal_data.id_user AND users.id = personal_data.id_user AND personal_data.id_user=type_user.id_user WHERE location.users_id = '${rows[0]?.id_user}'`
            const data =await conn2.query(querySearchId)
            const result = data[0][0]
            if(result.type !== "pas" || !result.status_pas) return 202;
            const coords = JSON.parse(result?.coords)
            const pas = {
                calle:result.street_name,
                coords,
                cuit:result.cuit,
                date:result.date,
                depto:result.depto,
                dni:result.dni,
                email:result.email,
                phone_number:result.phone_number,
                postal_code:result.postal_code,
                type:result.type,
                id:result.id_user,
                name:result.name,
                last_name:result.last_name,
                location:result.city,
                description:result.description,
                route:rows[0].route
            };
            return pas
        }catch(e){
            return e;
        }
    }
    static async updateTypeUser (type,idUser,validate) {
        const id = crypto.randomUUID()
        const queryUpdateSQL = `UPDATE type_user SET type = "${type}" WHERE id_user = '${idUser}';`
        const querySearchRegister = `SELECT * FROM products_users WHERE users_id='${idUser}';` 
        try{
            if( !validate ){
                return "Access Denied";
            }
            else{
                let [ResultSetHeader] = await conn2.query(queryUpdateSQL)
                if(ResultSetHeader.affectedRows){
                    const [rows] = await conn2.query(querySearchRegister)
                    if(!rows.length){
                        let [ResultSetHeader] = await conn2.query(`INSERT INTO 
                                products_users 
                                (id,users_id) 
                                VALUES ('${id}','${idUser}')`)
                        if(ResultSetHeader.affectedRows) return true
                        else return false
                    }
                    else return false
                } else return false
        }
        }catch(e){
            return e
        }
    }
    static async getPasUser (numberPage) {
        const query = `SELECT type_user.*, personal_data.*  FROM type_user JOIN personal_data on type_user.id_user = personal_data.id_user WHERE type = "pas" LIMIT ${(numberPage - 1) * 7}, 7;`
    try {
        const [rows] = await conn2.query(query)
        return rows;
    } 
    catch (e) {
        return e;
    }
    }
    static async getAllUsers (numberPage) {
        const query = `SELECT type_user.*, personal_data.*  FROM type_user JOIN personal_data on type_user.id_user = personal_data.id_user WHERE type = "client" OR type = "pas" OR type = "admin" LIMIT ${(numberPage - 1) * 7}, 7;`
    try {
        const [rows] = await conn2.query(query)
        return rows;
    } 
    catch (e) {
        return e;
    }
    }
    static async getStatusPas (estatus,idUser,validate) {
        const queryUpdateSQL = `UPDATE type_user SET status_pas = "${estatus}" WHERE id_user = '${idUser}' ;`
    try {
        if(!validate) return "Access Denied";
        let [ResultSetHeader] = await conn2.query(queryUpdateSQL)
        if(ResultSetHeader.affectedRows){
            return true
        }else{
            return "error";
        }
    } 
    catch (e) {
        return e;
    }
    }
    static async searchUserByEmail (email) {
        const querySearchUser = `SELECT personal_data.*,type_user.type FROM personal_data join type_user on personal_data.id_user = type_user.id_user WHERE email LIKE "%${email || ""}%" and type in ("client", "pas","admin")`
    try {
        let [rows] = await conn2.query(querySearchUser)
        return rows
    } 
    catch (e) {
        return e;
    }
    }
    static async myPersonalData (userId,type) {
        const location = `select location.* , personal_data.password, users.img,users.description, personal_data.phone_number, personal_data.route from location join personal_data join users where location.users_id ='${userId}' AND personal_data.id_user='${userId}' AND users.id ='${userId}'`
    try {
        let [rows] = await conn2.query(location)
        let coords;
        type === "pas" ? coords = JSON.parse(rows[0]?.coords) : coords
        const data = {
            city:rows[0].city,
            image:rows[0]?.img,
            coords:`${coords?.long},${coords?.lat}`,
            password:rows[0].password,
            postal_code:rows[0].postal_code,
            phone_number:rows[0].phone_number,
            province:rows[0].province,
            street_name:rows[0].street_name,
            description:rows[0].description,
            route:rows[0].route,
            type:type,
        }
        console.warn(data);
        return data
    } 
    catch (e) {
        return e;
    }
    }
    static async updateUserInfo (users,user) {        
    const upadatePersonalData = `UPDATE personal_data SET phone_number = "${users.phone_number || ""}" WHERE id_user = '${user.id}'`
    let coord = users.coords.split(",")
    coord = {
        long:coord[0],
        lat:coord[1]
    }
    coord = JSON.stringify(coord) 
    const routeExistsQuery = `SELECT 1 FROM personal_data WHERE route = ? AND id_user != ? LIMIT 1`;
    const updateRoute = `UPDATE personal_data SET route = '${users.route || ""}' WHERE id_user = '${user.id}'`;
    const updateCoords = `UPDATE location SET coords = '${coord || ""}' , street_name = "${users.street_name || ""}" , city = "${users.city || ""}" , province = "${users.province || ""}", postal_code = "${users.postal_code || ""}" WHERE users_id = '${user.id}';`
    const updateUser = `UPDATE users SET description = '${users.description}' where id = '${user.id}'`
    
    try{
        const [existingRoute] = await conn2.query(routeExistsQuery, [
            users.route,
            user.id,
        ]);

        if (existingRoute.length > 0) {
            const errorMessage = "Ya existe otro usuario con la misma ruta.";
            return false;
        } else {
        await conn2.query(upadatePersonalData)
        await conn2.query(updateCoords)
        await conn2.query(updateRoute)
        await conn2.query(updateUser)
        return true;
        }
    }catch(e){
        return false;
    }
    }
    static async getClientsOfPas (idPas) {
        const searchClientsPas = `select * from orders where pas_id = '${idPas}' AND status_payment ='authorized'`
        try{
            const [rows] = await conn2.query(searchClientsPas)
            return rows;
        }catch(error){
            return error
        }
    }
    static async getAllRoutes (idPas) {
        const getRoutes = `SELECT route FROM personal_data where id_user = '${idPas}'`;
        try {
            const [rows] = await conn2.query(getRoutes)
            return rows;
        } catch (error) {
            return error;
        }
    }
    static async getPasInfo (idPas) {
        const getPasInfo = `SELECT name, last_name, phone_number, email, route FROM personal_data WHERE id_user = '${idPas}'`
        try{
            const [rows] = await conn2.query(getPasInfo)
            return rows
        } catch (error) {
            return error
        }
    }
}

module.exports = {UserModels}