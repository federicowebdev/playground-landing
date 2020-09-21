// In questo file gestisco tutte le operazioni esaustive delle API riguardanti l'url dei results: '/api/v1/tabs'

//richiamo il plugin filesystem per la lettrura e scrittura dei file
const fs = require('fs');

//leggo il file tabs.json
const jsondb = 'tabs';
const tabsjson = JSON.parse(fs.readFileSync(`${__dirname}/../ajax/${jsondb}.json`));

exports.getTabs = (req, res) => {
  try {
    const id = req.params.id * 1;
    const tab = tabsjson.find((el) => {
      return (el.id === id) ? el : null
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour: tab,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: `Something went wrong: ${error}`,
    });
  }
};
