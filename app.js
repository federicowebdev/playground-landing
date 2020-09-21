const express = require('express');
const path = require('path');
const morgan = require('morgan');

//sfrutto il ramework express
const app = express();

const resultRouter = require('./routes/resultRoutes');

if (process.env.NODE_ENV === 'development') {
  //se il modalità di avvio del server è in "development", mostro le chiamate
  //http request nella console del terminale tramite il plugin morgan
  app.use(morgan('dev'));
}

//indico all'app che tutti i dati che vengono restituiti al client devono essere in formato json
app.use(express.json());

//setto la path per i file statici contenuti nella cartella public
app.use(express.static(path.join(__dirname, 'public')));

//renderizzo la pagina index.html
//per semplicità non gestisco l'errore 404(page not found)
app.get('/', (req, res) => {
  res.status(200).sendFile('index.html');
});

//routing delle API per le operazioni di CRUD
app.use('/api/v1/result', resultRouter);

module.exports = app;
