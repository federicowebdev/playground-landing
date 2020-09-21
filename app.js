const express = require('express');
const path = require('path');
const morgan = require('morgan');

//sfrutto il ramework express
const app = express();

const tabsRouter = require('./routes/tabsRoutes');

if (process.env.NODE_ENV === 'development') {
  //se il modalità di avvio del server è in "development", mostro le chiamate
  //http request nella console del terminale tramite il plugin morgan
  app.use(morgan('dev'));
}

//indico all'app che tutti i dati che vengono restituiti al client devono essere in formato json
app.use(express.json());

//setto la path per i file statici contenuti nella cartella public
app.use(express.static(path.join(__dirname, 'public')));

//routing delle API per le operazioni di CRUD
app.use('/api/v1/tabs', tabsRouter);

//renderizzo la pagina index.html
app.get('/', (req, res) => {
  res.status(200).sendFile('index.html');
});

//gestisco l'errore 404(page not found)
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: `Cannot find ${req.originalUrl} on the server!`,
  });
});

module.exports = app;
