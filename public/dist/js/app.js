(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.App = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

//In questo file creo l'istanza Vue e la associo al tag main con id="app"
//in questo modo rendo reattiva l'intera pagina e posso effettuare tutte le operazioni di binding
var app = new Vue({
  el: '#app',
  data: {
    configs: [],
    alert: {
      visibility: false,
      status: '',
      message: '',
      class: ''
    },
    operators: ['+', '-', '*', '/']
  },
  mounted: function mounted() {
    var _this = this;

    //tramite ajax prendo le configurazioni per impostare i form e le input ad esso associate,
    //inoltre setto anche il comportamento delle input in base ai parametri recuperati
    axios.get('/api/v1/result/').then(function (res) {
      //console.log(res.data.config);
      for (var i = 0; i < res.data.config.length; i++) {
        var obj = {
          params: res.data.config[i].params.map(function (el) {
            return {
              name: el.name,
              value: null,
              rules: {
                min: el.rules && el.rules.maj ? el.rules.maj : null,
                maj: el.rules && el.rules.min ? el.rules.min : null
              },
              isWrong: true,
              messageValidation: ''
            };
          }),
          operationForResult: res.data.config[i].result,
          result: '',
          resultTxt: '',
          resultPreview: '',
          disabled: true
        };
        obj.resultTxt = obj.operationForResult.join().replaceAll(',', '');
        _this.configs.push(obj);
      }
      //console.log(this.configs);
    });
  },

  methods: {
    //questa funzione ritorna true -> isNumber, false -> is NaN
    chekIsNanValue: function chekIsNanValue(number) {
      return isNaN(number);
    },
    //questa funzione effettua la validazione di tutti i campi in base alla configurazione del file xml
    //solamente quando ogni parametro rispetta la sua natura, i pulsanti di preview e di submit vengono abilitati
    validateInput: function validateInput(param, config) {
      var val = param.value;
      var result = {};

      if (val == '' || val == null) {
        param.isWrong = true;
        param.messageValidation = 'Il campo non può rimanere vuoto!';
      } else if (this.chekIsNanValue(val)) {
        param.isWrong = true;
        param.messageValidation = 'Il campo deve essere un numero!';
      } else {
        for (var operator in param.rules) {
          var exactValue = param.rules[operator];
          result = this.checkParamValue(val, operator, exactValue);
          if (result.state == false) {
            param.isWrong = true;
            param.messageValidation = result.message;
            break;
          } else {
            param.isWrong = false;
            param.messageValidation = '';
          }
        }
      }

      this.checkDisabled(config);
    },
    checkDisabled: function checkDisabled(config) {
      var isOk = config.params.filter(function (el) {
        return el.isWrong == false;
      });

      if (isOk.length != config.params.length) {
        config.disabled = true;
      } else {
        config.disabled = false;
      }
    },
    checkParamValue: function checkParamValue(a, operator, b) {
      var result = { state: true, message: '' };

      if (operator == 'min' && b !== null) {
        if (a <= b) {
          return { state: false, message: 'Il valore \xE8 minore di ' + b };
        }
      }

      if (operator == 'maj' && b != null) {
        if (a >= b) {
          return { state: false, message: 'Il valore \xE8 maggiore di ' + b };
        }
      }

      return result;
    },
    //questa funzione effettua una preview di come dovrebbe essere il risultato finale
    previewResult: function previewResult(config) {
      if (config.disabled) {
        return;
      }
      var operation = '';
      for (var i = 0; i < config.operationForResult.length; i++) {
        operation += this.getValue(config.operationForResult[i], config);
      }
      config.resultPreview = operation;
      config.result = eval(operation);
    },
    getValue: function getValue(item, config) {
      if (this.operators.indexOf(item) != -1) {
        return item;
      } else if (Array.isArray(item)) {
        var op = '';
        for (var i = 0; i < item.length; i++) {
          op += this.getValue(item[i], config);
        }
        return op;
      } else {
        return config.params.find(function (el) {
          return el.name == item;
        }).value;
      }
    },
    getDateTimeNow: function getDateTimeNow() {
      var today = new Date();

      var date = today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate();

      var time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();

      return date + '-' + time;
    },
    //questa funzione effettua una chiamata ajax alle API esposte con nodejs
    //precisamente effettua una chiamata in POST, quindi stiamao parlando di una creazione di contenuti
    submitResult: function submitResult(config) {
      var _this2 = this;

      if (config.disabled) {
        return;
      }

      this.previewResult(config);

      //predispongo il model per essere inviato in un unico blocco all'API
      var model = {
        created_at: this.getDateTimeNow(),
        browser: navigator.userAgent,
        parameters: config.params.map(function (el) {
          return {
            name: el.name,
            value: el.value
          };
        }),
        resultPreview: config.resultPreview,
        result: config.result
      };

      axios.post('/api/v1/result/', {
        model: model
      }).then(function (res) {
        console.log(res);
        if (res.data.status == 'success') {
          //show alert/toast success
          _this2.alert.status = 'Success';
          _this2.alert.message = 'Il risultato è stato salvato correttamente nei nostri database!';
          _this2.alert.class = 'alert alert-success alert-dismissible';
          _this2.alert.visibility = true;
        } else {
          //show alert/toast error
          _this2.alert.status = 'Error';
          _this2.alert.message = 'Si è verificato un errore in fase di salvataggio!';
          _this2.alert.class = 'alert alert-danger alert-dismissible';
          _this2.alert.visibility = true;
        }
        _this2.clearForm(config);
      });
    },
    clearForm: function clearForm(config) {
      config.result = '';
      config.resultPreview = '';
      config.disabled = true;
      config.params.forEach(function (el) {
        el.value = '';
      });
    }
  }
});

},{}]},{},[1])(1)
});
