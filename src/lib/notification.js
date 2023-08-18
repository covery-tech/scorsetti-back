const {conn} = require("../config/connection");

const postNotificationPas = (idPas, description, idClient) => {
    const emitNotification = `INSERT INTO notification_for_user (id_pas,description,id_admin) VALUES ('${idPas ? idPas : null}','${description}','${idClient? idClient : null}')`;
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
    const emitNotification = `INSERT INTO notification_client (idClient,description) VALUES ('${idclient}','${description}')`;
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
