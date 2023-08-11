const conn = require("../config/connection");
const { validateUserType } = require("../lib/validateUserType");

const getProductCard = (req, res) => {
    // const querySelectSQL = "SELECT * FROM `forms`"
    // try{
    //     conn.query(querySelectSQL,function(err,result){
    //         if(err) res.status(400).send(err)
    //         const info = result?.map(e=>{
    //             let data = JSON.parse(e.info_form)
    //             return {
    //
    // }                id:e.id,
    //                 image:data.image,
    //                 product_title: data.productTitle || data.product_title
    //             }
    //         })
    //         res.status(200).send(info)
    //     })
    // }catch(e){
    //     res.status(400).send(e)
};

const createInterTableProductUser = (req, res) => {
    const { idUser, idProduct } = req.body;
    const data = new Date();
    const fechaActual = data.toLocaleDateString();
    const queryIntoNewProduct = `INSERT INTO user_product ( id_user, id_product, create_date ) VALUES (${idUser},${idProduct},"${fechaActual}");`;
    try {
        conn.query(queryIntoNewProduct, function (err, result) {
            if (err) res.status(400).send(err);
            else {
                //(result);
                res.status(200).send(true);
            }
        });
    } catch (e) {
        res.status(400).send(e);
    }
};

const getPassProductsEneable = (req, res) => {
    const { idUser } = req.params;
    const querySelectProducts = `SELECT * FROM products_users WHERE users_id = '${idUser}'`;
    try {
        conn.query(querySelectProducts, function (err, result) {
            if (err) res.status(400).send(err);
            else {
                if (result.length) {
                    let data = [
                        result[0].auto === "habilitado" && "auto",
                        result[0].moto === "habilitado" && "moto",
                        result[0].hogar === "habilitado" && "hogar",
                        result[0].avipar === "habilitado" && "avipar",
                        result[0].acc_personal === "habilitado" && "ap",
                        result[0].coti_auto_moto === "habilitado" &&
                            "grupomotoauto",
                    ];
                    data = data.filter((e) => e !== false);
                    data = {
                        products: data,
                        user_id: result[0].users_id,
                    };
                    return res.status(200).send(data);
                } else {
                    return res.status(200).send("userPas no encontrado");
                }
            }
        });
    } catch (e) {
        res.status(400).send(e);
    }
};

const updateStatusProduct = (req, res) => {
    const { status, idPas, column } = req.params;
    const queryUpdateSQL = `UPDATE products_users SET ${column} = "${status}" WHERE users_id = '${idPas}';`;
    try {
        conn.query(queryUpdateSQL, function (err, result) {
            if (err) res.status(400).send(err);
            else {
                res.status(200).send(true);
            }
        });
    } catch (e) {
        res.status(400).send(e);
    }
};

const getPassProductsAll = (req, res) => {
    const { idUser } = req.params;
    const query = `select * from products_users where users_id = '${idUser}'`;
    try {
        conn.query(query, (err, resp) => {
            if (err) return res.status(500).send("server error");
            const data = [
                {
                    title: "Auto",
                    status: resp[0]?.auto,
                    name: "auto",
                },
                {
                    title: "Moto",
                    status: resp[0]?.moto,
                    name: "moto",
                },
                {
                    title: "Hogar",
                    status: resp[0]?.hogar,
                    name: "hogar",
                },
                {
                    title: "Avipar",
                    status: resp[0]?.avipar,
                    name: "avipar",
                },
                {
                    title: "Accidentes Personales",
                    status: resp[0]?.acc_personal,
                    name: "ap",
                },
                {
                    title: "Cotización Grupal Motos y Autos",
                    status: resp[0]?.coti_auto_moto,
                    name: "coti_auto_moto",
                },
            ];
            return res.status(200).send(data);
        });
    } catch (err) {
        res.status(400).send(err);
    }
};

const getMyProductsSale = (req, res) => {
    const { idPas, page } = req.params;
    const number = parseInt(page);
    const query = `select orders.*,personal_data.* from orders  join personal_data on orders.users_id = personal_data.id_user where orders.pas_id = '${idPas}' LIMIT ${
        (number - 1) * 7
    }, 7;`;
    try {
        conn.query(query, (err, resp) => {
            if (err) res.status(500).send("servier error");
            res.status(200).send(resp);
        });
    } catch (e) {
        res.status(400).send(e);
    }
};

const numberOfOrders = (req, res) => {
    const { idPas } = req.params;
    const query = `select COUNT(*) from orders where pas_id = '${idPas}' AND status_payment='authorized'`;
    try {
        conn.query(query, (err, resp) => {
            if (err) res.status(500).send(err);
            else {
                res.status(200).send(resp[0]);
            }
        });
    } catch (err) {
        res.status(400).send(err);
    }
};

const reduceArrayWithElementsRepeat = (array) => {
    const miArraySinRepetidos = array.filter(
        (elem, index, self) =>
            index === self.findIndex((e) => e.users_id === elem.users_id)
    );
    return miArraySinRepetidos;
};

const numberOfClients = (req, res) => {
    const { idPas } = req.params;
    const query = `select users_id from orders where pas_id ='${idPas}'`;
    try {
        conn.query(query, (err, resp) => {
            if (err) res.status(500).send(err);
            else {
                let data = reduceArrayWithElementsRepeat(resp);
                data = data.length;
                res.status(200).send({ data });
            }
        });
    } catch (err) {
        res.status(400).send(err);
    }
};

const amountOfOrders = (req, res) => {
    const { idPas } = req.params;
    const query = `select amount from orders where pas_id = '${idPas}' AND status_payment = 'authorized'`;
    try {
        conn.query(query, (err, resp) => {
            if (err) res.status(500).send(err);
            else {
                const sum = resp.reduce(
                    (accumulator, currentValue) =>
                        accumulator + parseInt(currentValue.amount),
                    0
                );
                res.status(200).send({ sum });
            }
        });
    } catch (err) {
        res.status(400).send(err);
    }
};

const emitNotificationPas = (req, res) => {
    const { idPas, description } = req.body;
    const emitNotification = `INSERT INTO notification (idPas,description,emmiter_type) VALUES ('${idPas}','${description}','pas')`;
    try {
        conn.query(emitNotification, (err, resp) => {
            if (err) res.status(500).send(err);
            else {
                res.status(200).send(true);
            }
            return;
        });
    } catch (err) {
        res.status(400).send(err);
    }
};

const getNotificationAdmin = (req, res) => {
    const { page } = req.params;
    const number = parseInt(page);
    let query = `select notification.*,users.img,personal_data.name,personal_data.last_name,personal_data.email,personal_data.phone_number
   from notification JOIN users JOIN personal_data ON notification.idPas = users.id AND notification.idPas = personal_data.id_user AND notification.enable = 1 LIMIT ${
       (number - 1) * 7
   }, 7;`;
    try {
        conn.query(query, (err, resp) => {
            if (err) res.status(500).send(err);
            else res.status(200).send(resp);
        });
    } catch (err) {
        res.status(400).send(err);
    }
};
// const queryUpdateSQL = `UPDATE products_users SET ${column} = "${status}" WHERE users_id = ${idPas};`;

const getNotificationPas = (req, res) => {
    const { page } = req.params;
    const { user } = req;
    const number = parseInt(page);
    let query = `select notification_for_user.*,users.img,personal_data.name,personal_data.last_name,personal_data.email,personal_data.phone_number

      from notification_for_user JOIN users JOIN personal_data ON notification_for_user.id_pas = users.id AND notification_for_user.id_pas = personal_data.id_user AND notification_for_user.enable = 1 where id_pas = ${
          user.id
      } LIMIT ${(number - 1) * 7}, 7;`;
    try {
        conn.query(query, (err, resp) => {
            if (err) res.status(500).send(err);
            else res.status(200).send(resp);
        });
    } catch (err) {
        res.status(400).send(err);
    }
};

const deleteNotificationAdmin = (req, res) => {
    const { idNoti } = req.params;
    const queryUpdate = `UPDATE notification set enable = "0" where id = '${idNoti}'`;
    try {
        conn.query(queryUpdate, (err, resp) => {
            if (err) res.status(500).send(err);
            else res.status(200).send(true);
        });
    } catch (err) {
        res.status(400).send(err);
    }
};

const deleteNotificationPas = (req, res) => {
    const { idNoti } = req.params;

    const queryUpdate = `UPDATE notification_for_user set enable = "0" where id = '${idNoti}'`;
    try {
        conn.query(queryUpdate, (err, resp) => {
            if (err) res.status(500).send(err);
            else res.status(200).send(true);
        });
    } catch (err) {
        res.status(400).send(err);
    }
};

const emitNotificationAdmin = (req, res) => {
    const { idPas, description, idAdmin } = req.body;
    const emitNotification = `INSERT INTO notification_for_user (id_pas,description,id_admin) VALUES ('${idPas}','${description}',${idAdmin})`;
    try {
        conn.query(emitNotification, (err, resp) => {
            if (err) res.status(500).send(err);
            else {
                res.status(200).send(true);
            }
            return;
        });
    } catch (err) {
        res.status(400).send(err);
    }
};

const getCountNotis = (req, res) => {
    try {
        const query = `select COUNT(*) from notification where enable='1'`;
        conn.query(query, (err, resp) => {
            if (err) res.status(500).send(err);
            else {
                res.status(200).send(resp);
            }
        });
    } catch (err) {
        res.status(400).send(err);
    }
};

const getCountNotisPas = (req, res) => {
    const { user } = req;
    try {
        const query = `select COUNT(*) from notification_for_user where enable='1' AND id_pas = ${user.id}`;
        conn.query(query, (err, resp) => {
            if (err) res.status(500).send(err);
            else {
                res.status(200).send(resp);
            }
        });
    } catch (err) {
        res.status(400).send(err);
    }
};

const postCoti = (req, res) => {
    const { idPas, data, idAdmin } = req.body;
    let id;
    if (idPas) {
        id = idPas;
    } else if (idAdmin) {
        id = idAdmin;
    }
    const currentDateTime = new Date();
    currentDateTime.setHours(currentDateTime.getHours() - 3);
    const dateTime = currentDateTime
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
    const postCotiz = `INSERT INTO orders_records (name, lastname, type, document, phone, province, email, sub_type, price, pas_id, date) VALUES ('${data.name}', '${data.lastname}', '${data.type}', '${data.document}', '${data.phone}', '${data.province}', '${data.email}', '${data?.sub_type}', '${data.price}', '${id}', '${dateTime}')`;
    try {
        conn.query(postCotiz, (err, resp) => {
            if (err) res.status(500).send(err);
            else {
                res.status(200).send(true);
            }
            return;
        });
    } catch (err) {
        res.status(400).send(err);
    }
};

const postCotiJson = (req, res) => {
    const { idPas, data, idAdmin, jsonData } = req.body;
    let id;
    if (idPas) {
        id = idPas;
    } else if (idAdmin) {
        id = idAdmin;
    }
    const currentDateTime = new Date();
    currentDateTime.setHours(currentDateTime.getHours() - 3);
    const dateTime = currentDateTime
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
    jsonData1 = JSON.stringify(jsonData);
    const postCotiz = `INSERT INTO orders_records (name, lastname, type, document, phone, province, email, sub_type, price, pas_id, date, all_person) VALUES ('${data.name}', '${data.lastname}', '${data.type}', '${data.document}', '${data.phone}', '${data.province}', '${data.email}', '${data?.sub_type}', '${data.price}', '${id}', '${dateTime}', '${jsonData1}')`;
    try {
        conn.query(postCotiz, (err, resp) => {
            if (err) res.status(500).send(err);
            else {
                res.status(200).send(true);
            }
            return;
        });
    } catch (err) {
        res.status(400).send(err);
    }
};

const getAllOrders = (req, res) => {
    const ordersQuery =
        "SELECT `orders`.`id`, `orders`.`date`, `orders`.`users_id`, `orders`.`amount`, `orders`.`type`, `orders`.`status_payment`, `orders`.`application_id`, `orders`.`pas_id`, `orders`.`client_id_mercado`, `orders`.`name`, `orders`.`last_name`, `orders`.`phone_number`, `orders`.`email`, NULL AS `sub_type`, NULL AS `document`, NULL AS `phone`, NULL AS `province`, NULL AS `price`, `orders`.`all_person` FROM `orders` UNION SELECT `orders_records`.`id`, `orders_records`.`date`, NULL AS `users_id`, NULL AS `amount`, NULL AS `type`, NULL AS `status_payment`, NULL AS `application_id`, `orders_records`.`pas_id`, NULL AS `client_id_mercado`, `orders_records`.`name`, `orders_records`.`lastname`, `orders_records`.`phone`, `orders_records`.`email`, `orders_records`.`sub_type`, `orders_records`.`document`, `orders_records`.`phone`, `orders_records`.`province`, `amount` AS `orders_records`.`price`, `orders_records`.`all_person` FROM `orders_records` ORDER BY date ASC";

    try {
        conn.query(ordersQuery, (err, results) => {
            if (err) {
                res.status(500).send(
                    "Error al obtener los datos de las tablas 'orders' y 'orders_records': " +
                        err
                );
                return;
            }

            const data = {
                ordersData: results,
            };

            res.status(200).json(data);
        });
    } catch (err) {
        res.status(500).send(
            "Error al obtener los datos de las tablas 'orders' y 'orders_records'"
        );
    }
};

const getAllOrdersByPas = (req, res) => {
    const idPas = 6;
    // const idPas = req.params.idPas;
    const page = parseInt(req.query.page) || 1; // Obtener el número de página de la consulta
    const limit = parseInt(req.query.limit) || 10; // Obtener la cantidad de resultados por página

    // Calcular el desplazamiento (offset) basado en la página actual y la cantidad de resultados por página
    const offset = (page - 1) * limit;

    const ordersQuery = `
      SELECT orders.type, orders.id, orders.date, orders.users_id, orders.amount, orders.status_payment, orders.application_id, orders.pas_id, orders.client_id_mercado, orders.name, orders.last_name, orders.phone_number, orders.email, NULL AS sub_type, NULL AS document, NULL AS phone, NULL AS province, NULL AS price, orders.all_person, NULL AS description, NULL AS description, NULL AS client, NULL AS cotizated
      FROM orders
      UNION ALL
      SELECT orders_backoffice.type, orders_backoffice.id, orders_backoffice.date, orders_backoffice.user_id, NULL AS amount, NULL AS status_payment, NULL AS application_id, NULL AS pas_id, NULL AS client_id_mercado, NULL AS name, NULL AS lastname, NULL AS phone, NULL AS email, NULL AS sub_type, NULL AS document, NULL AS phone, NULL AS province, NULL AS price, orders_backoffice.description AS all_person, NULL AS description, orders_backoffice.description, orders_backoffice.client, orders_backoffice.cotizated
      FROM orders_backoffice      
      ORDER BY date DESC
      LIMIT ${limit}
      OFFSET ${offset}`;

    try {
        conn.query(ordersQuery, (err, results) => {
            if (err) {
                res.status(500).send(
                    "Error al obtener los datos de las tablas 'orders' y 'orders_records':" +
                        err
                );
                return;
            }
            // {
            //     type: 'Auto',
            //     id: 19,
            //     date: 'NOW()',
            //     users_id: '6',
            //     amount: null,
            //     status_payment: null,
            //     application_id: null,
            //     pas_id: null,
            //     client_id_mercado: null,
            //     name: null,
            //     last_name: null,
            //     phone_number: null,
            //     email: null,
            //     sub_type: null,
            //     document: null,
            //     phone: null,
            //     province: null,
            //     price: null,
            //     all_person: '{"año":"2015","marca":"Renault","modelo":"Clio 1.2","cerokm":false,"tipo_uso":"Particular","vigencia":"Mensual"}',
            //     description: '{"año":"2015","marca":"Renault","modelo":"Clio 1.2","cerokm":false,"tipo_uso":"Particular","vigencia":"Mensual"}',
            //     client: '{"nombre":"Patricio","apellido":"Pereyra Gargiulo","tipo_documento":"DNI","numero_documento":"44069182","sexo":"Masculino","fecha_nacimiento":"2002-03-05","domicilio":"B siglo 21","ciudad":"Capital","provincia":"Santiago del estero","email":"Patricioperey',
            //     cotizated: 0
            //   }

            const data = results.map((r) => {
                return {
                    type: r?.type,
                    id: r?.id,
                    date: r?.date,
                    id_pas: r?.user_id,
                    status_payment: r?.status_payment,
                    application_id: r?.application_id,
                    client_id_mercado: r?.client_id_mercado,
                    name: `${r?.name} ${r?.last_name}`,
                    phone_number: r?.phone_number,
                    email: r?.email,
                    sub_type: r?.sub_type,
                    document: r?.document,
                    province: r?.province,
                    amount: r?.amount,

                };
            });
            res.status(200).json(data);
        });
    } catch (err) {
        res.status(500).send(
            "Error al obtener los datos de las tablas 'orders' y 'orders_records'"
        );
    }
};

const postOrdersBackoffice = (req, res) => {
    const pas_id = req.body.params
    const { tipo, description, client } = req.body.values;
    const jsonDescription = JSON.stringify(description);
    const jsonClient = JSON.stringify(client);
    const queryBackoffice = `INSERT INTO orders_backoffice (type, description, client, pas_id) VALUES ('${tipo}', '${jsonDescription}', '${jsonClient}', ${pas_id})`;
    try {
        conn.query(queryBackoffice, (err, results) => {
            if (err) res.status(500).send(err);
            else {
                res.status(200).send(true);
            }
            return;
        });
    } catch (err) {
        res.status(400).send(err);
    }
};

module.exports = {
    getProductCard,
    createInterTableProductUser,
    getPassProductsEneable,
    updateStatusProduct,
    getPassProductsAll,
    getMyProductsSale,
    numberOfOrders,
    numberOfClients,
    amountOfOrders,
    emitNotificationPas,
    getNotificationAdmin,
    getNotificationPas,
    deleteNotificationAdmin,
    emitNotificationAdmin,
    getCountNotis,
    getCountNotisPas,
    deleteNotificationPas,
    postCoti,
    postCotiJson,
    getAllOrders,
    getAllOrdersByPas,
    postOrdersBackoffice,
};
