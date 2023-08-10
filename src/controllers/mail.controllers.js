require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "c1451757.ferozo.com",
  port: 465,
  auth: {
    user: "noreply@emititupoliza.com",
    pass: "Broker2022",
  },
});

function sendEmail({
  recipient_email,
  inner_mail,
  subject,
  attachFile,
  file_path,
  filename,
}) {
  return new Promise((resolve, reject) => {
    const mail_configs = {
      from: process.env.EMAIL,
      to: recipient_email,
      subject: subject,
      html: inner_mail,
    };

    if (attachFile) {
      if (file_path && filename) {
        mail_configs.attachments = [
          {
            filename: filename,
            path: file_path,
          },
        ];
      }
    }

    transporter.sendMail(mail_configs, function (error, info) {
      if (error) {
        console.log(error);
        return reject({ message: `An error has occurred` } + error);
      }
      return resolve({ message: "Email sent successfully" });
    });
  });
}

module.exports = {
  sendEmail,
  transporter,
  sendMailCertificate: (email, filename) => {
    return {
      from: process.env.EMAIL,
      to: email,
      subject: "Certificado de cobertura",
      html: `<h1>Certificado de cobertura</h1>
      <a href="https://api.emititupoliza.com/${filename}">Descarga tu certificado de cobertura</a>`,
    };
  },
  sendEmailCoti: (jsonData) => {
    const { tipo, description, client } = jsonData.values;
    const emailContent = `
            <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; background-color: #ffffff; padding: 20px; border: 1px solid #dddddd;">
              <div style="text-align: center;">
                <img src="https://www.scorsettiseguros.com.ar/img/isologo1.jpg" alt="Scorsetti Asociados" style="max-width: 200px;">
                <h2 style="margin: 10px 0; color: #083180;">Scorsetti Asociados</h2>
              </div>
              <p style="color: #083180;">Tienes pendiente en el market la cotización del producto ${tipo}.</p>
              <div style="margin-top: 20px; color: #083180;">
                <p><strong>Datos de cliente</strong></p>
                <p><strong>Nombre:</strong> ${client.nombre} ${
      client.apellido
    }</p>
                <p><strong>Email:</strong> ${client.email}</p>
                <p><strong>Teléfono:</strong> ${client.telefono}</p>
                <br>
                <p><strong>Datos de producto</strong></p>
                ${Object.entries(description)
                  .map(([key, value]) => {
                    const formattedKey = key
                      .replace(/_/g, " ")
                      .replace(
                        /(^|[^áéíóú])\w+/g,
                        (match) =>
                          match.charAt(0).toUpperCase() + match.slice(1)
                      );
                    return `
                      <p>
                        <strong>${formattedKey}:</strong> ${value}
                      </p>
                    `;
                  })
                  .join("")}
              </div>
              <p style="margin-top: 20px; color: #083180;">Verifica en el dashboard del market si ya está cotizado.</p>
            </div>
          `;

    const emailOptions = {
      recipient_email: process.env.EMAILSCORSETTI,
      inner_mail: emailContent,
      subject: "Cotización requerida",
    };

    return sendEmail(emailOptions); // Realizar el envío aquí y devolver la Promesa
  },
  sendEmailCotiClient: (jsonData) => {
    const { tipo, description, client } = jsonData.values;
    const emailContent = `
          <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; background-color: #ffffff; padding: 20px; border: 1px solid #dddddd;">
            <div style="text-align: center;">
              <img src="https://www.scorsettiseguros.com.ar/img/isologo1.jpg" alt="Scorsetti Asociados" style="max-width: 200px;">
              <h2 style="margin: 10px 0; color: #083180;">Scorsetti Asociados</h2>
            </div>
            <p style="color: #083180;">Su producto está siendo cotizado ${tipo}.</p>
            <div style="margin-top: 20px; color: #083180;">
              <p><strong>Sus Datos Personales</strong></p>
              <p><strong>Nombre:</strong> ${client.nombre} ${
      client.apellido
    }</p>
              <p><strong>Email:</strong> ${client.email}</p>
              <p><strong>Teléfono:</strong> ${client.telefono}</p>
              <br>
              <p><strong>Datos del producto</strong></p>
              ${Object.entries(description)
                .map(([key, value]) => {
                  const formattedKey = key
                    .replace(/_/g, " ")
                    .replace(
                      /(^|[^áéíóú])\w+/g,
                      (match) => match.charAt(0).toUpperCase() + match.slice(1)
                    );
                  return `
                    <p>
                      <strong>${formattedKey}:</strong> ${value}
                    </p>
                  `;
                })
                .join("")}
            </div>
            <p style="margin-top: 20px; color: #083180;">Será contactado a la brevedad.</p>
          </div>
        `;

    const emailOptions = {
      recipient_email: client.email,
      inner_mail: emailContent,
      subject: "Cotización solicitada",
    };

    return sendEmail(emailOptions); // Realizar el envío aquí y devolver la Promesa
  },
};
