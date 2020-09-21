// In questo file gestisco tutte le operazioni esaustive delle API riguardanti l'url dei results: '/api/v1/tabs'

//richiamo il plugin filesystem per la lettrura e scrittura dei file
const fs = require('fs');

//leggo il file tabs.json
const jsondb = 'tabs';
let resultsjson;
resultsjson = JSON.parse(
  fs.readFileSync(`${__dirname}/../ajax/${jsondb}.json`)
);


