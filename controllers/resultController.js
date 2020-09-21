// In questo file gestisco tutte le operazioni esaustive delle API riguardanti l'url dei results: '/api/v1/result'

//richiamo il plugin filesystem per la lettrura e scrittura dei file
const fs = require('fs');
//richiamo il plugin xml2js per la lettrura di file xml
const xml2js = require('xml2js');

const parser = new xml2js.Parser({ attrkey: '$' });

const Result = require('./../models/resultModel');
let resultsjson;

//leggo il file jsondb.json solo se sono nella modalità 'development'
//altrimenti effettuo una connessione ad un db online tramite moongose verso la piattaforma Atlas MongoDb
const jsondb = 'jsondb';
if (process.env.NODE_ENV == 'development') {
  resultsjson = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/${jsondb}.json`)
  );
}

const config = [];
const fileName = 'config';

//leggo il file di configurazione config.xml per poter esaurire la risposta alla chiamata ajax lato client
//durante l'inizializzazione del progetto mentre Vue è in modalità 'mounting'
const xml_string = fs.readFileSync(
  `${__dirname}/../dev-data/${fileName}.xml`,
  'utf8'
);

parser.parseString(xml_string, function (error, result) {
  if (error === null) {
    const convertion = JSON.parse(JSON.stringify(result));
    let params = convertion.results.parametri;
    for (let i = 0; i < params.length; i++) {
      let newParams = params[i].parametro.map((el) => {
        return {
          name: el.$.nome,
          rules: {
            maj: el.maggiore != undefined ? el.maggiore[0] * 1 : null,
            min: el.minore != undefined ? el.minore[0] * 1 : null,
          },
        };
      });
      let expr = new RegExp('(?<=[-+*/])|(?=[-+*/])');
      let splitter = params[i].risultato.toString();
      let res = splitter.split(expr);
      res = res.map((el) => {
        return (el = el.trim());
      });
      //per comodità trasformo il file xml letto in precedenza in formato json
      config.push({
        params: newParams,
        result: res,
      });
    }
  } else {
    console.log(error);
  }
});

// API -> get '/api/v1/result/' --> restituisce tutti gli elementi necessari per creare
// il layout del form lato client
exports.getConfig = (req, res) => {
  res.status(200).json({
    status: 'success',
    config: config,
  });
};

// API -> post '/api/v1/result/' --> effettua il salvataggio dei dati passati tramite POST
exports.createResult = async (req, res) => {
  try {
    if (process.env.NODE_ENV == 'production') {
      //salvo i dati nel db mongodb sulla piattaforma online Atlas MongoDb
      const newResult = await Result.create(req.body.model);

      res.status(201).json({
        status: 'success',
        data: {
          result: newResult,
        },
      });
    } else {
      //salvo i dati nel db locale jsondb.json per effettuare dei test sulla qualità del salvataggio
      const newId =
        resultsjson.length > 0 ? resultsjson[resultsjson.length - 1].id + 1 : 0;
      const newResult = Object.assign({ id: newId }, req.body.model);
      resultsjson.push(newResult);
      fs.writeFile(
        `${__dirname}/../dev-data/${jsondb}.json`,
        JSON.stringify(resultsjson),
        (err) => {
          res.status(201).json({
            status: 'success',
            results: resultsjson.length,
            data: {
              tour: newResult,
            },
          });
        }
      );
    }
  } catch (err) {
    res.status(400).json({
      status: 'success',
      message: err,
    });
  }
};
