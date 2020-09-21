export class Workers {

  constructor(){
    this.$html = this.$s("html");
    this.$body = this.$s("body");
    this.$header = this.$s("header");
    this.page = '';
    this.$isMobile = this.$html.classList.contains("mobile");
    this.$isTablet = this.$html.classList.contains("tablet");
    this.$isIE = this.$html.classList.contains("ie");
    this.isAjaxNav = false;
    this.language = this.$html.getAttribute("lang");
    this.main_language = 'it';
    this.init();
  }

  init(){
    String.prototype.capitalize = function() {
      return this.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
    };
  }

  checkElement(element){
    return document.querySelector(element);
  }

  removeElement(element){
    if(this.$isIE){
      this.$body.removeChild(element);
    }else{
      element.remove();
    }
  }

  $(element){
    return document.querySelectorAll(element);
  }

  $s(element){
    return document.querySelectorAll(element)[0];
  }

  ajaxReq(data, success, failure) {

    var self = this;
    var oReq = new XMLHttpRequest();
    var send_data = null;
    oReq.onload = function(){
      var vMsg, nStatus = this.status;
      if(nStatus == 200){
        //console.log(this.responseText);
        //vMsg = JSON.parse(this.responseText);
        success(this.responseText);
      }
      else{
        self.ajaxError();
      }
    };

    oReq.onerror = this.ajaxError;
    oReq.open("POST", data.url, true);
    if(data.type){
      send_data = JSON.stringify(data.data);
    }else{
      oReq.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      send_data = data.data;
    }
    // oReq.setRequestHeader("Content-type","application/json");
    // oReq.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    oReq.send(send_data);
  }

  // ajaxDone(vMsg){
  //   console.log("done");
  // }

  ajaxError () {
    console.log("Unknown error, a problem with server!.");
  }

};
