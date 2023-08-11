const mercadopago = require("mercadopago");
const axios = require("axios");
const conn = require("../config/connection");
require("dotenv").config();

const createPlan = (req, res) => {
  const { usersId, vehicle, pas_id, repetitions, amount, title, type } = req.body;
  console.log(req.body);
  mercadopago.configure({
    access_token: process.env.SECRET_BEARER_MP,
  });
  let preference = {
    reason: type,
    auto_recurring: {
      frequency: 1,
      frequency_type: "days",
      repetitions: 4,
      billing_day_proportional: true,
      transaction_amount: amount,
      currency_id: "ARS",
    },
    payment_methods_allowed: {
      payment_types: [{}],
      payment_methods: [{}],
    },
    back_url: "https://libra.emititupoliza.com",
    payer_email: "test_user_604067994@testuser.com",
    notification_url:
      process.env.MP_NOTIFICATION + "/mp/notification",
  };
  console.log(preference);
  const config = {
    method: "POST",
    baseURL: `https://api.mercadopago.com/preapproval_plan`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.SECRET_BEARER_MP}`,
    },
    data: preference,
  };
  axios(config)
    .then(function (response) {
      console.log(response.data);
      const order = response.data;
      conn.query(
        `INSERT INTO orders (users_id,amount,repetitions,type,vehicle,status_payment,application_id,pas_id, date_update) 
          VALUES 
          ("${usersId}",${order.auto_recurring.transaction_amount},${order.auto_recurring.repetitions},"suscription","${vehicle}","create-plan","${order.id}","${pas_id}",CURRENT_TIMESTAMP)`,
        (err, result) => {
          if (err) return res.status(400).send(err);
          else {
            return res.status(200).send(order);
          }
        }
      );
    })
    .catch(function (error) {
      console.log(error);
      res.status(401).send(error);
    });
};

function createPlanSuscriptionPreapproval(id) {
  const config = {
    method: "get",
    baseURL: `https://api.mercadopago.com/preapproval/${id}`,
    headers: {
      Authorization: `Bearer ${process.env.SECRET_BEARER_MP}`,
    },
  };
  axios(config).then((e) => {
    conn.query(
      `UPDATE orders SET status_payment = 'created-plan', date_update = CURRENT_TIMESTAMP  WHERE application_id = '${e.data.preapproval_plan_id}'`,
      (err, result) => {
        if (err) return err;
        else return "okey";
      }
    );
  });
  return;
}

function updatePlanSuscriptionPreapproval(id, statusPayment) {
  const config = {
    method: "get",
    baseURL: `https://api.mercadopago.com/preapproval/${id}`,
    headers: {
      Authorization: `Bearer ${process.env.SECRET_BEARER_MP}`,
    },
  };
  axios(config).then((e) => {
    conn.query(
      `UPDATE orders SET status_payment = '${statusPayment}', date_update = CURRENT_TIMESTAMP  WHERE application_id = '${e.data.preapproval_plan_id}'`,
      (err, result) => {
        if (err) return err;
        else return "okey";
      }
    );
  });
  return;
}

function updateCreatePlan(id) {
  conn.query(
    `UPDATE orders SET status_payment = "created-plan", date_update = CURRENT_TIMESTAMP  WHERE application_id = ${id}`,
    (err, response) => {
      if (err) {
        return err;
      } else {
        return "okey";
      }
    }
  );
  return;
}

function authorizedPayment(idPayment) {
  const config = {
    method: "get",
    baseURL: `https://api.mercadopago.com/authorized_payments/${idPayment}`,
    headers: {
      Authorization: `Bearer ${process.env.SECRET_BEARER_MP}`,
    },
  };
  axios(config).then((e) => {
    updatePlanSuscriptionPreapproval(e.data.preapproval_id, "authorized");
  });
  return;
}

const notificationOrder = (req, res) => {
  const { query, body } = req;
  //({body,query})
  if (body.action === "created" && body.type === "subscription_preapproval") {
    createPlanSuscriptionPreapproval(query["data.id"]);
  }
  if (
    body.action === "created" &&
    body.type === "subscription_preapproval_plan"
  ) {
    updateCreatePlan(query["data.id"]);
  }
  if (
    body.action === "update" &&
    body.type !== "subscription_authorized_payment"
  ) {
    updatePlanSuscriptionPreapproval(query["data.id"], "pending");
  }
  if (
    (body.action === "created" &&
      body.type === "subscription_authorized_payment") ||
    (body.action === "update" &&
      body.type === "subscription_authorized_payment")
  ) {
    authorizedPayment(query["data.id"]);
  }
  return res.status(200).send("ok");
};

module.exports = {
  createPlan,
  notificationOrder,
};
