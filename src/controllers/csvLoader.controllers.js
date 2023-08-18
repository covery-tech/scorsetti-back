const {conn} = require("../config/connection");
const fs = require('fs');
const csv = require('csv-parser');
const axios = require('axios');

const multer = require('multer');

// Configurar Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../api/src/uploads/'); // Directorio donde se guardarán los archivos cargados
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

const uploadCSV = async (req, res) => {
  const { token } = res.body
  if (!req.file) {
    return res.status(400).send('No se seleccionó ningún archivo');
  }

  const archivo = req.file;
  const registros = [];

  await new Promise((resolve, reject) => {
    fs.createReadStream(archivo.path)
      .pipe(csv())
      .on('data', (row) => {
        const registro = {};

        registro['cod_brand'] = parseInt(row['cod_marca'].replace(/\./g, ''), 10);
        registro['brand'] = row['txt_desc'];
        registro['cod_model'] = parseInt(row['cod_modelo'].replace(/\./g, ''), 10);
        registro['model'] = row['txt_desc.1'];

        registros.push(registro);
      })
      .on('end', () => {
        fs.unlinkSync(archivo.path);
        resolve();
      })
      .on('error', (err) => {
        reject(err);
      });
  });

  try {
    await new Promise((resolve, reject) => {
      const queryDeleteSQL = 'DELETE FROM moto_data';
      conn.query(queryDeleteSQL, (err, result) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve();
        }
      });
    });

    const queryInsertSQL = 'INSERT INTO moto_data (cod_brand, brand, cod_model, model) VALUES ?';
    const values = registros.map(registro => [
      registro['cod_brand'],
      registro['brand'],
      registro['cod_model'],
      registro['model']
    ]);
    conn.query(queryInsertSQL, [values], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error al insertar los datos en la base de datos');
      }
      return res.status(200).send(true);
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send('Error al insertar los datos en la base de datos');
  }
};


const uploadMoto = (req, res) => {
  const registros = res.locals.registros;
  const queryIntroSQL = 'INSERT INTO moto_data SET ?';
  conn.query(queryIntroSQL, registros, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error al insertar los datos en la base de datos');
    }

    return res.status(200).send(true);
  });
};

module.exports = {
  uploadMoto,
  uploadCSV,
  upload: upload.single('archivo')
};
