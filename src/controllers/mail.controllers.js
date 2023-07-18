require("dotenv").config();
const nodemailer = require("nodemailer");

function sendEmail({
  recipient_email,
  inner_mail,
  subject,
  attachFile,
  file_path,
  filename,
}) {
  return new Promise((resolve, reject) => {
    var transporter = nodemailer.createTransport({
      host: "c1451757.ferozo.com",
      port: 465,
      auth: {
        user: "noreply@emititupoliza.com",
        pass: "Broker2022",
      },
    });

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
        return reject({ message: `An error has occured`  } + error);
      }
      return resolve({ message: "Email sent succesfuly" });
    });
  });
}


module.exports = {
  sendEmail,
  transporter:nodemailer.createTransport({    
    host: "c1451757.ferozo.com",
    port: 465,
    auth: {
      user: "noreply@emititupoliza.com",
      pass: "Broker2022",   
  }}),
  sendMailCertificate:(email, filename)=>{
    return {
      from: process.env.EMAIL,
      to: email,
      subject: "Certificado de cobertura",
      html: `<h1>Certificado de cobertura</h1>
      <a href="https://api.emititupoliza.com/${filename}">Descarga tu certificado de cobertura</a>`,
      // attachFile: true,
      // filename: filename,
      // path: filename,      
    }
  }
};
