const axios = require("axios");
const conn = require("../config/connection");
const moment = require("moment-timezone");

const postTokenPas = (req, res) => {
  const config = {
    method: "POST",
    baseURL: `http://uat.libraseguros.com.ar/Sise3GBELibraCoreUatWebApi/token`,
    data: req.body.formData,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  };
  axios(config)
    .then((resp) => {
      res.status(200).send(resp.data);
      return resp.data;
    })
    .catch((e) => {
      // //(e)
      res.status(500).send(e);
      return e;
    });
};

const getPlanComercial = (req, res) => {
  const { token, codeRamo, typeAget, idAgent, validTypeId } = req.body;
  const config = {
    method: "get",
    baseURL: `http://uat.libraseguros.com.ar/Sise3GBELibraCoreUatWebApi/api/quotation/CommercialProductsByBranchAgentValidityType?PrefixId=${codeRamo}&AgentTypeId=${typeAget}&AgentId=${idAgent}&ValidityTypeId=${validTypeId}`,
    headers: { Authorization: `bearer ${token}` },
  };
  axios(config)
    .then((resp) => {
      //(resp.data)
      res.status(200).send(resp.data);
      return;
    })
    .catch((e) => {
      if (e.response.status === 401) {
        res.status(401).send("Authorization has been denied for this request.");
        return;
      }
      res.status(400).send(e);
      return;
    });
  return;
};

const getConducto = (req, res) => {
  const { token, codeProduct, codeRamo } = req.body;
  const config = {
    method: "get",
    baseURL: `http://uat.libraseguros.com.ar/Sise3GBELibraCoreUatWebApi/api/quotation/PaymentMethodsPlansByProduct?ProductCode=${codeProduct}&CommercialPrefixId=${codeRamo}`,
    headers: { Authorization: `bearer ${token}` },
  };
  axios(config)
    .then((resp) => {
      //(resp.data)
      res.status(200).send(resp.data);
      return;
    })
    .catch((e) => {
      if (e?.response?.status === 401) {
        res.status(401).send("Authorization has been denied for this request.");
        return;
      }
      res.status(400).send(e);
      return;
    });
  return;
};

const getBrand = (req, res) => {
  const { token, year } = req.body;
  const config = {
    method: "get",
    baseURL: `http://uat.libraseguros.com.ar/Sise3GBELibraCoreUatWebApi/api/quotation/MarksByYear?Year=${year}`,
    headers: { Authorization: `bearer ${token}` },
  };
  axios(config)
    .then((resp) => {
      res.status(200).send(resp.data);
      return;
    })
    .catch((e) => {
      if (e.response.status === 401) {
        res.status(401).send("Authorization has been denied for this request.");
        return;
      }
      res.status(400).send(e);
      return;
    });
  return;
};

const getModelsByMarkYear = (req, res) => {
  const { token, year, brandCode } = req.body;
  const config = {
    method: "get",
    baseURL: `http://uat.libraseguros.com.ar/Sise3GBELibraCoreUatWebApi/api/quotation/ModelsByMarkYear?Year=${year}&MarkCode=${brandCode}`,
    headers: { Authorization: `bearer ${token}` },
  };
  axios(config)
    .then((resp) => {
      filteredData = resp.data.DatosAdicionales
      return res.status(200).send(filteredData);
    })
    .catch((e) => {
      if (e?.response?.status === 401) {
        return res
          .status(401)
          .send("Authorization has been denied for this request.");
      }
      return res.status(400).send(e);
    });
};

const getCotizacionAuto = (req, res) => {
  const { token, values, codeRamo } = req.body;
  const accessories = values.accessories?.map((e) => {
    return {
      Id: e.codigo_accesorio,
      Precio: e.valor,
    };
  });
  var valid;
  if (values.validity === "Mensual") {
    valid = 1;
    validMonths = 1;
  } else if (values.validity === "Trimestral") {
    valid = 4;
    validMonths = 3;
  }
  dateInit = moment().tz("America/Argentina/Buenos_Aires");
  currentDate = dateInit.format("YYYY-MM-DD HH:mm:ss");
  dateFinish = dateInit
    .add(validMonths, "months")
    .format("YYYY-MM-DD HH:mm:ss");
  if (values.adjustment === "20%") {
    adjust = 3;
  } else {
    adjust = 4;
  }


  const data2 = {
    RiesgosPorRamo: [
      {
        "kilometraje": values.zerokm,
        "AnioVehiculo": values.year,
        "Marca": values.brand.markCode,
        "Modelo": values.model.modelCode,
        "Origen": values.model.originDescription,
        "Valor": values.model.price.toString(),
        "tipo": values.model?.descriptionType,
        "Uso": 1,
        "ClausulaAjuste": adjust,
        "Accesorios": accessories,
      },
    ],
    "Ramo": codeRamo,
    "CodTipoAgente": 4,
    "CodAgente": 2938,
    "Tomador": 1,
    "TipoTomador": "F",
    //tipo de tomador deja elegir
    "CondicionFiscal": 1,
    "TipoVigencia": valid,
    "VigenciaDesde": currentDate, //se calcula
    "VigenciaHasta": dateFinish,
    "PlanComercial": values.planCommercial ? values.planCommercial : "24",
    // "Conducto": paymentMethod.code2 ? paymentMethod.code2 : 1,
    "Conducto": 1,
    "Provincia": 2,
    "Municipio": 1,
    "CodPostal": "1761",
  };  


  const config = {
    method: "post",
    baseURL: `http://uat.libraseguros.com.ar/Sise3GBELibraCoreUatWebApi/api/quotation/GenerarCotizacion`,
    headers: { Authorization: `bearer ${token}` },
    data: data2,
  };
  //(config)
  axios(config)
    .then((resp) => {
      //("funciona")
      res.status(200).send(resp.data);
      return;
    })
    .catch((e) => {
      if (e.response.status === 401) {
        res.status(401).send("Authorization has been denied for this request.");
        return;
      }
      res.status(400).send(e);
      return;
    });
  return;
};

// "RiesgosPorRamo":[
//     {
//     "kilometraje":false,
//     "AnioVehiculo":2015,
//     "Marca":3,
//     "Modelo":26318,
//     "Origen":"IMPORTADO",
//     "Valor":3600000,
//     "tipo":"Automovil",
//     "Uso":1,
//     "ClausulaAjuste":1,
//     "Accesorios":[
//         {"Id":1,
//         "Precio":10000
//         }]
//         }],
// "Ramo":4,
// "CodTipoAgente":2,
// "CodAgente":1343,
// "Tomador":482105,
// "TipoTomador":"F",
// "CondicionFiscal":1,
// "TipoVigencia":2,
// "VigenciaDesde":"2022-10-05 12:00:00",
// "VigenciaHasta":"2023-04-05 12:00:00",
// "PlanComercial":13,
// "Conducto":1,
// "PlanDePago":1,
// "Provincia":2,
// "Municipio":1,
// "CodPostal":"1761"
// }

const getAccesories = (req, res) => {
  const { token } = req.body;
  const config = {
    method: "get",
    baseURL: `http://uat.libraseguros.com.ar/Sise3GBELibraCoreUatWebApi/api/quotation/AccessoriesList`,
    headers: { Authorization: `bearer ${token}` },
  };
  axios(config)
    .then((resp) => {
      //(resp.data)
      res.status(200).send(resp.data);
    })
    .catch((e) => {
      // if(e.response.status===401){
      //     res.status(401).send("Authorization has been denied for this request.")
      //     return
      // }
      res.status(400).send(e);
    });
  return;
};

const getMotoBrands = (req, res) => {
  // const {token} = req.body
  const queryGetBrands =
    "SELECT DISTINCT brand, cod_brand FROM moto_data order by brand ASC;";
  try {
    conn.query(queryGetBrands, function (err, result) {
      if (err) res.status(400).send(err);
      else {
        res.status(200).send(result);
      }
    });
  } catch (e) {
    res.status(400).send(e);
  }
};

const getMotoModels = (data, res) => {
  const { cod_brand } = data.query;
  // const markCode = cod_brand && JSON.parse(cod_brand).markCode;
  const queryGetModels =
    "SELECT DISTINCT model, cod_model FROM moto_data WHERE cod_brand = ? ORDER BY model ASC;";
  try {
    conn.query(queryGetModels, [cod_brand], function (err, result) {
      if (err) res.status(400).send(err);
      else {
        res.status(200).send(result);
      }
    });
  } catch (e) {
    res.status(400).send(e);
  }
};

const getCotizacionMoto = (req, res) => {
  const { token, values, codeRamo } = req.body;

  let valid;
  if (values.validity === "Mensual") {
    valid = 1;
    validMonths = 1;
  } else if (values.validity === "Trimestral") {
    valid = 4;
    validMonths = 3;
  }
  dateInit = moment().tz("America/Argentina/Buenos_Aires");
  currentDate = dateInit.format("YYYY-MM-DD HH:mm:ss");
  dateFinish = dateInit
    .add(validMonths, "months")
    .format("YYYY-MM-DD HH:mm:ss");
  if (values.adjustment === "20%") {
    adjust = 3;
  } else {
    adjust = 4;
  }

  const data2 = {
    RiesgosPorRamo: [
      {
        "kilometraje": values.zerokm,
        "AnioVehiculo": parseInt(values.year),
        "Marca": values.brand.markCode,
        "Modelo": values.model.modelCode,
        "Origen": values.model.originDescription,
        "Valor": values.model.price.toString(),
        "tipo": values.model?.descriptionType,
        "Uso": 1,
        "ClausulaAjuste": 3,       
      },
    ],
    "Ramo": codeRamo.toString(),
    "CodTipoAgente": 4,
    "CodAgente": 2938,
    "Tomador": "1",
    "TipoTomador": "F",
    //tipo de tomador deja elegir
    "CondicionFiscal": "1",
    "TipoVigencia": valid,
    "VigenciaDesde": currentDate, //se calcula
    "VigenciaHasta": dateFinish,
    "PlanComercial": values.planComercial ? values.planComercial : "2",
    "Conducto": 1,
    "PlanDePago": 1,
    "Provincia": 2,
    "Municipio": 1,
    "CodPostal": "1761",
    "Recargos": [],
    "Descuentos": []
  };
 console.log(data2);
  const config = {
    method: "post",
    baseURL: `http://uat.libraseguros.com.ar/Sise3GBELibraCoreUatWebApi/api/quotation/GenerarCotizacion`,
    headers: { Authorization: `bearer ${token}` },
    data: data2,
  };
  //(config)
  axios(config)
    .then((resp) => {
      //("funciona")
      console.log(resp.data);
      res.status(200).send(resp.data);
      return;
    })
    .catch((e) => {
      if (e.response.status === 401) {
        res.status(401).send("Authorization has been denied for this request.");
        return;
      }
      res.status(400).send(e);
      return;
    });
  return;
};



module.exports = {
  postTokenPas,
  getPlanComercial,
  getConducto,
  getBrand,
  getModelsByMarkYear,
  getCotizacionAuto,
  getAccesories,
  getMotoBrands,
  getMotoModels,
  getCotizacionMoto
};
