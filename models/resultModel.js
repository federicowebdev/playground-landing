//in questo file creo il modello e lo schema per come devono essere salvate le informazioni per questo documento
// di mongodb, sfrutto il plugin Moongose per creare delle regole di validazione, in questo caso 'required'
const mongoose = require('mongoose');

const paramSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Param deve avere un name!'],
  },
  value: {
    type: Number,
    required: [true, 'Param deve avere un value!'],
  },
});

const resultSchema = mongoose.Schema({
  created_at: {
    type: String,
    required: [true, 'Result deve avere un date!'],
  },
  browser: {
    type: String,
    required: [true, 'Result deve avere un browser signature!'],
  },
  parameters: {
    type: [paramSchema],
    required: [true, 'Result deve avere un params values!'],
  },
  resultPreview: {
    type: String,
    required: [true, 'Result deve avere un resultPreview!'],
  },
  result: {
    type: Number,
    required: [true, 'Result deve avere un result!'],
  },
});

const Result = mongoose.model('results', resultSchema);

module.exports = Result;
