
export class FormManager {

  constructor(){
    // this.apply = {
    //   form: window.workers.$s('#apply-form'),
    //   submitted: false,
    //   url: '',
    //   res_txt_ok: window.workers.$s('.result_text_ok'),
    //   //res_txt_err: window.workers.$s('.result_text_err'),
    // };
    this.contact = {
      form: window.workers.$s('#contact-form'),
      submitted: false,
      url: '',
      res_txt_ok: window.workers.$s('.result_text_ok'),
      //res_txt_err: window.workers.$s('.result_text_err'),
    };
    this.init();
  }

  init(){
    this.initEvents();
  }

  initEvents(){
    var self = this;
    // if(this.apply.form){
    //
    //   //form submit
    //   this.apply.form.addEventListener('submit', (e)=>{ this.applySubmit(e)}, false);
    //   this.apply.form.onclick = function(e){
    //     for(let i=0;i<this.elements.length;i++){
    //       if(this.elements[i].classList.contains("error")){
    //         this.elements[i].classList.remove("error");
    //       }
    //     }
    //     self.apply.res_txt_ok.classList.remove("in");
    //   };
    //
    //   //checkbox click
    //   this.apply.form.checkbox_apply.onclick = function(e){
    //     var checkbox = e.target;
    //     if (checkbox.checked) {
    //       self.apply.form.applyButton.classList.remove("disabled");
    //     } else {
    //       self.apply.form.applyButton.classList.add("disabled");
    //     }
    //   };
    // }

    if(this.contact.form){
      //form submit
      this.contact.form.addEventListener('submit', (e)=>{ this.onSubmit(e, this.contact.form)}, false);
      this.contact.form.onclick = function(e){
        for(let i=0;i<this.elements.length;i++){
          if(this.elements[i].classList.contains("error")){
            this.elements[i].classList.remove("error");
          }
        }
        self.contact.res_txt_ok.classList.remove("in");
      };

      //checkbox click
      this.contact.form.checkbox_privacy.onclick = function(e){
        var checkbox = e.target;
        if (checkbox.checked) {
          self.contact.form.sendButton.classList.remove("disabled");
        } else {
          self.contact.form.sendButton.classList.add("disabled");
        }
      };
    }
  }

  serializeForm(form) {
    var field, s = [];
    var i,j = 0;
    //if (typeof form == 'object' && form.nodeName == "form") {
    var len = form.elements.length;
    for (i=0; i<len; i++) {
      field = form.elements[i];
      if (field.name && !field.disabled && field.type != 'file' && field.type != 'reset' && field.type != 'submit' && field.type != 'button') {
        if (field.type == 'select-multiple') {
          for (j=form.elements[i].options.length-1; j>=0; j--) {
            if(field.options[j].selected)
            s[s.length] = encodeURIComponent(field.name) + "=" + encodeURIComponent(field.options[j].value);
          }
        } else if ((field.type != 'checkbox' && field.type != 'radio') || field.checked) {
          s[s.length] = encodeURIComponent(field.name) + "=" + encodeURIComponent(field.value);
        }
      }
    }
    //}
    return s.join('&').replace(/%20/g, '+');
  }

  onSubmit(e, form){
    //var form = this.contact.form;
    this.contact.data = this.serializeForm(form);
    //console.log(this.contact.data);
    this.contact.url = form.action;
    window.workers.ajaxReq(this.contact, (res)=>{this.onSuccess(res, form)});
    e.preventDefault();
    return false;
  }

  onSuccess(res, form){
    //console.log(res);
    this.contact.res_txt_ok.classList.remove("in");
    //this.apply.res_txt_err.classList.remove("in");
    if(res == 1){
      this.contact.res_txt_ok.classList.add("in");
    }
    else{
      for(let i=0;i<form.elements.length;i++){
        if(form.elements[i].classList.contains("error")){
          form.elements[i].classList.remove("error");
        }
      }
      var jsn = JSON.parse(res);
      for(var key in jsn) {
        var input = window.workers.$s("#"+key);
        input.classList.add("error");
        //console.log(key);
        //console.log(res[key]);
      }
    }
  }

};
