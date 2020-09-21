// In questo file configuro il server e la modalità di salvataggio dati:
// ci sono due modalità di salvataggio:
// 1- "production" -> consento la connessione al mongodb Atlas,
// 2- "development" -> i dati vengono salvati nel file jsondb.json che rappresenta il db locale 

const dotenv = require('dotenv');

const mongoose = require('mongoose');

dotenv.config({
  path: './config.env',
});

if (process.env.NODE_ENV == 'production') {
  const db = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
  );

  mongoose
    .connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    })
    .then((con) => {
      //console.log(con.connections);
      console.log('DB connected succesul');
    });
}

const app = require('./app');

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`app running on port ${port}`);
});
