const { conn2 } = require("../config/connection");
const {
    postNotificationPas,
    postNotificationClient,
} = require("../lib/notification");
const crypto = require("node:crypto");
const reduceArrayWithElementsRepeat = (array) => {
    const miArraySinRepetidos = array.filter(
        (elem, index, self) =>
            index === self.findIndex((e) => e.users_id === elem.users_id)
    );
    return miArraySinRepetidos;
};

class ProductModel {
    static async getProductsEneablePas(id) {
        const querySelectProducts = `SELECT * FROM products_users WHERE users_id = ?`;

        try {
            const [rows, fields] = await conn2.execute(querySelectProducts, [
                id,
            ]);
            const data = [
                rows[0].auto === "habilitado" && "auto",
                rows[0].moto === "habilitado" && "moto",
                rows[0].hogar === "habilitado" && "hogar",
                rows[0].avipar === "habilitado" && "avipar",
                rows[0].ap === "habilitado" && "ap",
                rows[0].coti_auto_moto === "habilitado" && "grupomotoauto",
            ].filter((e) => e !== false);

            return {
                products: data,
                user_id: rows[0].users_id,
            };
        } catch (error) {
            return error;
        }
    }
    static async updateStatusProduct(status, idPas, column) {
        const queryUpdateSQL = `UPDATE products_users SET ${column} = "${status}" WHERE users_id = '${idPas}'`;

        try {
            const [ResultSetHeader] = await conn2.execute(queryUpdateSQL);
            if (ResultSetHeader.affectedRows) {
                return true;
            }
            return false;
        } catch (error) {
            return error;
        }
    }
    static async getPassProductsAll(id) {
        const query = `select * from products_users where users_id = '${id}'`;
        try {
            const [rows] = await conn2.execute(query);
            if (!rows.length) return [];
            const data = [
                {
                    title: "Auto",
                    status: rows[0]?.auto,
                    name: "auto",
                },
                {
                    title: "Moto",
                    status: rows[0]?.moto,
                    name: "moto",
                },
                {
                    title: "Hogar",
                    status: rows[0]?.hogar,
                    name: "hogar",
                },
                {
                    title: "Avipar",
                    status: rows[0]?.avipar,
                    name: "avipar",
                },
                {
                    title: "Accidentes Personales",
                    status: rows[0]?.ap,
                    name: "ap",
                },
                {
                    title: "Cotización Grupal Motos y Autos",
                    status: rows[0]?.coti_auto_moto,
                    name: "coti_auto_moto",
                },
            ];
            return data;
        } catch (err) {
            return err;
        }
    }
    static async getMyProductsSale(idPas, page) {
        const query = `select orders.*,personal_data.* from orders  join personal_data on orders.users_id = personal_data.id_user where orders.pas_id = '${idPas}' LIMIT ${
            (page - 1) * 7
        }, 7;`;
        try {
            const data = await conn2.execute(query);
            return data;
        } catch (e) {
            return e;
        }
    }
    static async numberOfOrders(userType) {
        const query = userType
            ? `select COUNT(*) from orders where pas_id = '${userType}' AND status_payment='authorized'`
            : `select COUNT(*) from orders where status_payment='authorized'`;
        try {
            const [rows] = await conn2.execute(query);
            return rows;
        } catch (err) {
            return err;
        }
    }
    static async numberOfClient(userType) {
        try {
            const query = userType
                ? `select users_id from orders where pas_id ='${userType}'`
                : `select users_id from orders`;
            const [rows] = await conn2.query(query);
            let data = reduceArrayWithElementsRepeat(rows);
            return data.length;
        } catch (err) {
            return err;
        }
    }
    static async amountOfOrders(userType) {
        const query = userType
            ? `select amount from orders where pas_id = '${userType}' AND status_payment = 'authorized'`
            : `select amount from orders where status_payment = 'authorized'`;
        try {
            const [rows] = conn2.query(query);
            const sum = rows.reduce(
                (accumulator, currentValue) =>
                    accumulator + parseInt(currentValue.amount),
                0
            );
            return sum;
        } catch (err) {
            return err;
        }
    }
    static async dairySales(date, userType) {
        try {
            const sqlQuery = userType
                ? `SELECT SUM(amount) AS total_ventas FROM orders WHERE DATE(date) = '${date}' AND pas_id = '${userType}'`
                : `SELECT SUM(amount) AS total_ventas FROM orders WHERE DATE(date) = '${date}'`;
            const [rows] = await conn2.query(sqlQuery);
            const totalVentas = rows[0].total_ventas || 0;
            return totalVentas;
        } catch (err) {
            return err;
        }
    }
    static async emitNotificationPas(idPas, description) {
        try {
            const id = crypto.randomUUID();
            const emitNotification = `INSERT INTO notification (id,idPas,description) VALUES ('${id}','${idPas}','${description}')`;
            const [ResultSetHeader] = await conn2.query(emitNotification);
            if (ResultSetHeader.affectedRows) return true;
            return false;
        } catch (err) {
            return err;
        }
    }
    static async getNotificationAdmin(numberPage) {
        const query = `select notification.*,users.img,personal_data.name,personal_data.last_name,personal_data.email,personal_data.phone_number
        from notification JOIN users JOIN personal_data ON notification.idPas = users.id AND notification.idPas = personal_data.id_user AND notification.enable = 1 LIMIT ${
            (numberPage - 1) * 7
        }, 7;`;
        try {
            const [rows] = await conn2.query(query);
            return rows;
        } catch (err) {
            return err;
        }
    }
    static async getNotificationPas(idUser, numberPage) {
        let query = `select notification_for_user.*,users.img,personal_data.name,personal_data.last_name,personal_data.email,personal_data.phone_number

      from notification_for_user JOIN users JOIN personal_data ON notification_for_user.id_pas = users.id AND notification_for_user.id_pas = personal_data.id_user AND notification_for_user.enable = 1 where id_pas = '${idUser}' LIMIT ${
            (numberPage - 1) * 7
        }, 7;`;
        try {
            const [rows] = await conn2.query(query);
            return rows;
        } catch (err) {
            return err;
        }
    }
    static async getNotificationClient(idUser, numberPage) {
        let query = `select * from notification_client where enable = '1' and idClient = '${idUser}' LIMIT ${
            (numberPage - 1) * 7
        }, 7;`;
        try {
            const [rows] = await conn2.query(query);
            return rows;
        } catch (err) {
            return err;
        }
    }
    static async deleteNotification(idNoti, table) {
        try {
            const queryUpdate = `UPDATE ${table} set enable = "0" where id = '${idNoti}'`;
            const [ResultSetHeader] = await conn2.query(queryUpdate);
            if (ResultSetHeader.affectedRows) {
                return true;
            }
            return false;
        } catch (err) {
            return err;
        }
    }
    static async emitNotificationAdmin(idPas, description, idAdmin) {
        try {
            const id = crypto.randomUUID();
            const emitNotification = `INSERT INTO notification_for_user (id,id_pas,description,id_admin) VALUES ('${id}','${idPas}','${description}','${idAdmin}')`;
            const [ResultSetHeader] = await conn2.query(emitNotification);
            if (ResultSetHeader.affectedRows) return true;
            return false;
        } catch (err) {
            return err;
        }
    }
    static async getCountNotis() {
        try {
            const query = `select COUNT(*) from notification where enable='1'`;
            const [rows] = await conn2.query(query);
            return rows;
        } catch (err) {
            return err;
        }
    }
    static async getCountNotisPas(userId) {
        try {
            const query = `select COUNT(*) from notification_for_user where enable='1' AND id_pas = '${userId}'`;
            const [rows] = await conn2.query(query);
            return rows;
        } catch (err) {
            return err;
        }
    }
    static async postCoti(data, idPas) {
        //deprecate
        const id = crypto.randomUUID();
        const currentDateTime = new Date();
        currentDateTime.setHours(currentDateTime.getHours() - 3);
        const dateTime = currentDateTime
            .toISOString()
            .slice(0, 19)
            .replace("T", " ");
        const postCotiz = `INSERT INTO orders_records (id,name, lastname, type, document, phone, province, email, sub_type, price, pas_id, date) VALUES ('${id}','${data.name}', '${data.lastname}', '${data.type}', '${data.document}', '${data.phone}', '${data.province}', '${data.email}', '${data?.sub_type}', '${data.price}', '${idPas}', '${dateTime}')`;
        try {
            const [ResultSetHeader] = await conn2.query(postCotiz);
            if (ResultSetHeader.affectedRows) return true;
            return false;
        } catch (err) {
            return err;
        }
    }
    static async getAllOrdersByPas(idPas, page) {
        const ordersQuery = idPas
            ? `
        SELECT orders.type,
        orders.id,
        orders.date, 
        orders.users_id, 
        orders.amount, 
        orders.status_payment,
        orders.pas_id, 
        orders.name, 
        orders.last_name, 
        orders.phone_number, 
        orders.email, 
        NULL AS sub_type,
        NULL AS province,
        orders.all_person, 
        NULL AS description, 
        NULL AS client, 
        NULL AS cotizated
    FROM orders
    WHERE pas_id = '${idPas}'
    UNION
    SELECT orders_backoffice.type,
        orders_backoffice.id, 
        orders_backoffice.date, 
        orders_backoffice.users_id, 
        orders_backoffice.pas_id,
        NULL AS amount, 
        NULL AS status_payment,   
        NULL AS name, 
        NULL AS last_name, 
        NULL AS phone_number, 
        NULL AS email, 
        NULL AS sub_type, 
        NULL AS province, 
        NULL AS all_person, 
        orders_backoffice.description,
        orders_backoffice.client,
        orders_backoffice.cotizated
    FROM orders_backoffice 
    WHERE pas_id = '${idPas}'     
    ORDER BY date DESC
    LIMIT ${(page - 1) * 7},7
    `
            : `SELECT orders.type,
            orders.id,
            orders.date, 
            orders.users_id, 
            orders.amount, 
            orders.status_payment,
            orders.pas_id, 
            orders.name, 
            orders.last_name, 
            orders.phone_number, 
            orders.email, 
            NULL AS sub_type,
            NULL AS province,
            orders.all_person, 
            NULL AS description, 
            NULL AS client, 
            NULL AS cotizated FROM orders UNION ALL SELECT orders_backoffice.type,orders_backoffice.id, orders_backoffice.date, orders_backoffice.users_id, orders_backoffice.pas_id,NULL AS amount, NULL AS status_payment, NULL AS name, NULL AS last_name, NULL AS phone_number, NULL AS email, NULL AS sub_type, NULL AS province, NULL AS all_person, orders_backoffice.description, orders_backoffice.client, orders_backoffice.cotizated
          FROM orders_backoffice     
          ORDER BY date DESC
          LIMIT ${(page - 1) * 7},7`;

        const queryCount = idPas
            ? `
        SELECT COUNT(*) AS total_records
        FROM orders
        WHERE pas_id = '${idPas}'
        UNION
        SELECT COUNT(*) AS total_records    
        FROM orders_backoffice 
        WHERE pas_id = '${idPas}'
    `
            : `
    SELECT COUNT(*) AS total_records
        FROM orders
        UNION
        SELECT COUNT(*) AS total_records    
        FROM orders_backoffice 
    `;
        try {
            const results = await conn2.query(ordersQuery);
            const data = results[0].map((r) => {
                return {
                    type: r?.type,
                    id: r?.id,
                    date: r?.date,
                    id_pas: r?.pas_id,
                    name: `${r?.name} ${r?.last_name}`,
                    phone_number: r?.phone_number,
                    email: r?.email,
                    province: r?.province,
                    amount: r?.amount,
                    users_id: r?.users_id,
                    all_person: r?.all_person
                        ? JSON.parse(r?.all_person)
                        : r?.all_person,
                    description: r?.description
                        ? JSON.parse(r.description)
                        : r?.description,
                    client: r?.client ? JSON.parse(r.client) : r?.client,
                    cotizated: r?.cotizated,
                    status_payment: r?.status_payment,
                };
            });
            const response = await conn2.query(queryCount);
            let sumaTotal = 0;
            for (const resultado of response[0]) {
                sumaTotal += resultado.total_records;
            }
            return { orders: data, pages: sumaTotal };
        } catch (err) {
            return err;
        }
    }
    static async postOrdersBackoffice(
        idPas,
        tipo,
        description,
        client,
        users_id
    ) {
        const jsonDescription = JSON.stringify(description);
        const id = crypto.randomUUID();
        const jsonClient = JSON.stringify(client);
        const queryBackoffice = `INSERT INTO orders_backoffice (id,type, description, client, pas_id,users_id) VALUES ('${id}','${tipo}', '${jsonDescription}', '${jsonClient}', '${idPas}','${users_id}')`;
        try {
            const [ResultSetHeader] = await conn2.query(queryBackoffice);
            postNotificationPas(
                idPas,
                `Posible nuevo cliente, datos de contacto: Email ${client.email} , Tel: ${client.telefono}`,
                users_id,
            );
            postNotificationClient(
                users_id,
                `En breve un operador se comunicara con usted via email o whatsapp`
            );
            if (ResultSetHeader.affectedRows) return true;
            return false;
        } catch (err) {
            return err;
        }
    }
    static async getAllOrdersByUser(userId, page) {
        const ordersQuery = `
        SELECT orders.type,
        orders.id,
        orders.date, 
        orders.users_id, 
        orders.amount, 
        orders.status_payment,
        orders.pas_id, 
        orders.name, 
        orders.last_name, 
        orders.phone_number, 
        orders.email, 
        NULL AS sub_type,
        NULL AS province,
        orders.all_person, 
        NULL AS description, 
        NULL AS client, 
        NULL AS cotizated
    FROM orders
    WHERE users_id = '${userId}'
    UNION
    SELECT orders_backoffice.type,
        orders_backoffice.id, 
        orders_backoffice.date, 
        orders_backoffice.users_id, 
        orders_backoffice.pas_id,
        NULL AS amount, 
        NULL AS status_payment,   
        NULL AS name, 
        NULL AS last_name, 
        NULL AS phone_number, 
        NULL AS email, 
        NULL AS sub_type, 
        NULL AS province, 
        NULL AS all_person, 
        orders_backoffice.description,
        orders_backoffice.client,
        orders_backoffice.cotizated
    FROM orders_backoffice 
    WHERE users_id = '${userId}'     
    ORDER BY date DESC
    LIMIT ${(page - 1) * 7},7
    `;

        const queryCount = `
        SELECT COUNT(*) AS total_records
        FROM orders
        WHERE users_id = '${userId}'
        UNION
        SELECT COUNT(*) AS total_records    
        FROM orders_backoffice 
        WHERE users_id = '${userId}'
    `;
        try {
            const results = await conn2.query(ordersQuery);
            const data = results[0].map((r) => {
                return {
                    type: r?.type,
                    id: r?.id,
                    date: r?.date,
                    id_pas: r?.pas_id,
                    name: `${r?.name} ${r?.last_name}`,
                    phone_number: r?.phone_number,
                    email: r?.email,
                    province: r?.province,
                    amount: r?.amount,
                    users_id: r?.users_id,
                    all_person: r?.all_person
                        ? JSON.parse(r?.all_person)
                        : r?.all_person,
                    description: r?.description
                        ? JSON.parse(r.description)
                        : r?.description,
                    client: r?.client ? JSON.parse(r.client) : r?.client,
                    cotizated: r?.cotizated,
                    status_payment: r?.status_payment,
                };
            });
            const response = await conn2.query(queryCount);
            let sumaTotal = 0;
            for (const resultado of response[0]) {
                sumaTotal += resultado.total_records;
            }
            return { orders: data, pages: sumaTotal };
        } catch (err) {
            return err;
        }
    }
    static async updateCotizatedProduct(id, cotizated) {
        const updateQuery = `UPDATE orders_backoffice SET cotizated = "${
            cotizated === "1" ? 0 : 1
        }"  WHERE orders_backoffice.id = "${id}"`;

        try {
            const [ResultSetHeader] = await conn2.query(updateQuery);
            if (ResultSetHeader.affectedRows) {
                return true;
            }
            return false;
        } catch (err) {
            return err;
        }
    }
}

module.exports = { ProductModel };
