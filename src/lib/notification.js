const {conn} = require("../config/connection");
const crypto = require("node:crypto")

const postNotificationPas = (idPas, description, idClient) => {
    const id = crypto.randomUUID()
    const emitNotification = `INSERT INTO notification_for_user (id,id_pas,description,id_admin) VALUES ('${id},'${idPas ? idPas : null}','${description}','${idClient? idClient : null}')`;
    try {
        conn.query(emitNotification, (err, resp) => {
            if (err) return err;
            else {
                console.log("!")
                return true;
            }
        });
    } catch (err) {
        return err;
    }
};


const postNotificationClient = (idclient, description) => {
    const id = crypto.randomUUID()
    const emitNotification = `INSERT INTO notification_client (id,idClient,description) VALUES ('${id},'${idclient}','${description}')`;
    try {
        conn.query(emitNotification, (err, resp) => {
            if (err) return err;
            else {
                console.log("!")
                return true;
            }
        });
    } catch (err) {
        return err;
    }
};


module.exports = {
    postNotificationPas,
    postNotificationClient,
}
