//In questo file creo l'istanza Vue e la associo al tag main con id="app"
//in questo modo rendo reattiva l'intera pagina e posso effettuare tutte le operazioni di binding
const app = new Vue({
  el: '#app',
  data: {
    configs: [],
    alert: {
      visibility: false,
      status: '',
      message: '',
      class: '',
    },
    operators: ['+', '-', '*', '/'],
  },
  mounted() {
    //tramite ajax prendo le configurazioni per impostare i form e le input ad esso associate,
    //inoltre setto anche il comportamento delle input in base ai parametri recuperati
    axios.get('/api/v1/result/').then((res) => {
      //console.log(res.data.config);
      for (let i = 0; i < res.data.config.length; i++) {
        let obj = {
          params: res.data.config[i].params.map((el) => {
            return {
              name: el.name,
              value: null,
              rules: {
                min: el.rules && el.rules.maj ? el.rules.maj : null,
                maj: el.rules && el.rules.min ? el.rules.min : null,
              },
              isWrong: true,
              messageValidation: '',
            };
          }),
          operationForResult: res.data.config[i].result,
          result: '',
          resultTxt: '',
          resultPreview: '',
          disabled: true,
        };
        obj.resultTxt = obj.operationForResult.join().replaceAll(',', '');
        this.configs.push(obj);
      }
      //console.log(this.configs);
    });
  },
  methods: {
    //questa funzione ritorna true -> isNumber, false -> is NaN
    chekIsNanValue: function (number) {
      return isNaN(number);
    },
    //questa funzione effettua la validazione di tutti i campi in base alla configurazione del file xml
    //solamente quando ogni parametro rispetta la sua natura, i pulsanti di preview e di submit vengono abilitati
    validateInput: function (param, config) {
      let val = param.value;
      let result = {};

      if (val == '' || val == null) {
        param.isWrong = true;
        param.messageValidation = 'Il campo non può rimanere vuoto!';
      } else if (this.chekIsNanValue(val)) {
        param.isWrong = true;
        param.messageValidation = 'Il campo deve essere un numero!';
      } else {
        for (let operator in param.rules) {
          let exactValue = param.rules[operator];
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
    checkDisabled: function (config) {
      var isOk = config.params.filter((el) => {
        return el.isWrong == false;
      });

      if (isOk.length != config.params.length) {
        config.disabled = true;
      } else {
        config.disabled = false;
      }
    },
    checkParamValue: function (a, operator, b) {
      let result = { state: true, message: '' };

      if (operator == 'min' && b !== null) {
        if (a <= b) {
          return { state: false, message: `Il valore è minore di ${b}` };
        }
      }

      if (operator == 'maj' && b != null) {
        if (a >= b) {
          return { state: false, message: `Il valore è maggiore di ${b}` };
        }
      }

      return result;
    },
    //questa funzione effettua una preview di come dovrebbe essere il risultato finale
    previewResult: function (config) {
      if (config.disabled) {
        return;
      }
      let operation = '';
      for (let i = 0; i < config.operationForResult.length; i++) {
        operation += this.getValue(config.operationForResult[i], config);
      }
      config.resultPreview = operation;
      config.result = eval(operation);
    },
    getValue: function (item, config) {
      if (this.operators.indexOf(item) != -1) {
        return item;
      } else if (Array.isArray(item)) {
        let op = '';
        for (let i = 0; i < item.length; i++) {
          op += this.getValue(item[i], config);
        }
        return op;
      } else {
        return config.params.find((el) => {
          return el.name == item;
        }).value;
      }
    },
    getDateTimeNow: function () {
      var today = new Date();

      var date =
        today.getFullYear() +
        '/' +
        (today.getMonth() + 1) +
        '/' +
        today.getDate();

      var time =
        today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();

      return date + '-' + time;
    },
    //questa funzione effettua una chiamata ajax alle API esposte con nodejs
    //precisamente effettua una chiamata in POST, quindi stiamao parlando di una creazione di contenuti
    submitResult: function (config) {
      if (config.disabled) {
        return;
      }

      this.previewResult(config);

      //predispongo il model per essere inviato in un unico blocco all'API
      let model = {
        created_at: this.getDateTimeNow(),
        browser: navigator.userAgent,
        parameters: config.params.map((el) => {
          return {
            name: el.name,
            value: el.value,
          };
        }),
        resultPreview: config.resultPreview,
        result: config.result,
      };

      axios
        .post('/api/v1/result/', {
          model,
        })
        .then((res) => {
          console.log(res);
          if (res.data.status == 'success') {
            //show alert/toast success
            this.alert.status = 'Success';
            this.alert.message =
              'Il risultato è stato salvato correttamente nei nostri database!';
            this.alert.class = 'alert alert-success alert-dismissible';
            this.alert.visibility = true;
          } else {
            //show alert/toast error
            this.alert.status = 'Error';
            this.alert.message =
              'Si è verificato un errore in fase di salvataggio!';
            this.alert.class = 'alert alert-danger alert-dismissible';
            this.alert.visibility = true;
          }
          this.clearForm(config);
        });
    },
    clearForm: function (config) {
      config.result = '';
      config.resultPreview = '';
      config.disabled = true;
      config.params.forEach((el) => {
        el.value = '';
      });
    },
  },
});
