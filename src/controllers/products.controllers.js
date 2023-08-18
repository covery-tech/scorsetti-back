const { ProductModel } = require("../models/products.models");
const { conn } = require("../config/connection");

const verifyUser = (user) => (user.type === "superadmin") ? undefined : (user.type === "admin") ? undefined : user.id;

class productController {
    static async getPassProductsEneable (req, res) {
        const { idUser } = req.params;
        const products = await ProductModel.getProductsEneablePas(idUser)
        res.status(200).json(products)
    };
    static async updateStatusProduct(req, res) {
        const { status, idPas, column } = req.params;
        const state = await ProductModel.updateStatusProduct(status, idPas, column)
        res.status(200).send(state);
    }
    static async getPassProductsAll (req, res) {
        const { idUser } = req.params;
        const products = await ProductModel.getPassProductsAll(idUser)
        res.status(200).send(products);
    };
    static async getMyProductsSale (req, res) {
        const { idPas, page } = req.params;
        const numberPage = parseInt(page);
        const data = await ProductModel.getMyProductsSale(idPas,numberPage)
        res.status(200).send(data)
    };
    static async numberOfOrders (req, res) {
        const user = req.user;
        const userType = verifyUser(user)
        const data = await ProductModel.numberOfOrders(userType)
        res.status(200).send(data)  
    };
    static async numberOfClients (req, res) {
        const user = req.user;
        const userType = verifyUser(user)
        const data = await ProductModel.numberOfClient(userType)
        res.send({data})  
    };
    static async amountOfOrders (req, res) {
        const user = req.user;
        const userType = verifyUser(user)
        const data = await ProductModel.amountOfOrders(userType)
        res.send({data})
    }
    static async dairySales (req,res) {
        const user = req.user;
        const fecha = req.query.fecha;
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const day = currentDate.getDate();
        const date = fecha ? fecha : `${year}/${month}/${day}`
        const userType = verifyUser(user)
        const totalVentas  = await ProductModel.dairySales(date,userType)
        res.json({ fecha: date, totalVentas });
    }
    static async emitNotificationPas (req,res) {
        const { idPas, description } = req.body;
        const data = await ProductModel.emitNotificationPas(idPas,description)
        res.send(data);
    }
    static async getNotificationAdmin (req,res) {
        const { page } = req.params;
        const numberPage = parseInt(page);
        if(isNaN(numberPage)) return res.send([])
        const data = await ProductModel.getNotificationAdmin(numberPage)
        res.json(data);
    }
    static async getNotificationPas (req,res) {
        const { page } = req.params;
        const { user } = req;
        const numberPage = parseInt(page);
        if(isNaN(numberPage)) return res.send([])
        const data = await ProductModel.getNotificationPas(user.id,numberPage)
        res.send(data)
    }
    static async getNotificationClient (req,res) {
        const { page } = req.params;
        const { user } = req;
        const numberPage = parseInt(page);
        if(isNaN(numberPage)) return res.send([])
        const data = await ProductModel.getNotificationClient(user.id,numberPage)
        res.send(data);
    }
    static async deleteNotificationAdmin (req,res) {
        const { idNoti } = req.params;
        const state = await ProductModel.deleteNotificationAdmin(idNoti)
        res.send(state);
    }
    static async deleteNotificationPas (req,res) {
        const { idNoti } = req.params;
        const state = await ProductModel.deleteNotificationPas(idNoti)
        res.send(state);
    }
    static async emitNotificationAdmin (req,res) {
        const { idPas, description, idAdmin } = req.body;
        const state = await ProductModel.emitNotificationAdmin(idPas, description, idAdmin)
        res.send(state);
    }
    static async getCountNotis (req,res) {
        const data = await ProductModel.getCountNotis()
        res.send(data);
    }
    static async getCountNotisPas (req,res) {
        const { user } = req;
        const data = await ProductModel.getCountNotisPas(user.id)
        res.send(data);
    }
    static async getAllOrdersByPas (req,res) {
        const { idPas } = req.params
        const numberPage = parseInt(req.query.page) || 1;
        const data = await ProductModel.getAllOrdersByPas(idPas,numberPage)
        res.json(data);
    }
    static async postOrdersBackoffice (req,res) {
        const {pas_id} = req.query
        const { tipo, description, client, users_id } = req.body.values;
        console.log(pas_id,tipo, description, client, users_id)
        const data = await ProductModel.postOrdersBackoffice(pas_id,tipo, description, client, users_id)
        res.json(data);
    }
    static async getAllOrdersByUser (req,res) {
        const user  = req.user
        const pageNumber = parseInt(req.params.page) || 1;
        const data = await ProductModel.getAllOrdersByUser(user.id,pageNumber)
        res.json(data)
    }
    static async updateCotizatedProduct (req,res) {
        const { id, cotizated } = req.params;
        const data = await ProductModel.getAllOrdersByUser(id, cotizated)
        res.json(data)
    }
}

module.exports = {
    productController
};



// const postCotiJson = (req, res) => {
//     const { idPas, data, idAdmin, jsonData } = req.body;
//     let id;
//     if (idPas) {
//         id = idPas;
//     } else if (idAdmin) {
//         id = idAdmin;
//     }
//     const currentDateTime = new Date();
//     currentDateTime.setHours(currentDateTime.getHours() - 3);
//     const dateTime = currentDateTime
//         .toISOString()
//         .slice(0, 19)
//         .replace("T", " ");
//     jsonData1 = JSON.stringify(jsonData);
//     const postCotiz = `INSERT INTO orders_records (name, lastname, type, document, phone, province, email, sub_type, price, pas_id, date, all_person) VALUES ('${data.name}', '${data.lastname}', '${data.type}', '${data.document}', '${data.phone}', '${data.province}', '${data.email}', '${data?.sub_type}', '${data.price}', '${id}', '${dateTime}', '${jsonData1}')`;
//     try {
//         conn.query(postCotiz, (err, resp) => {
//             if (err) res.status(500).send(err);
//             else {
//                 res.status(200).send(true);
//             }
//             return;
//         });
//     } catch (err) {
//         res.status(400).send(err);
//     }
// };
