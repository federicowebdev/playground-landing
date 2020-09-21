
export class CookiesManager {

  constructor(){
    this.debug = false;
    this.setted = false;
    this.duration = 365; // 1 year
    this.status = {
      functional: true,
      analytics: true,
      socials: false,
      adv: false,
      other: false
    };
    this.lang = window.workers.language;
    this.text = {
      paragraph:{
        'it': "Per rendere l'esperienza dell'utente del sito web il più semplice e personale possibile, facciamo uso dei cookie. Li usiamo anche per garantire che noi e terze parti possiamo pubblicare annunci pertinenti per voi. Utilizzando il nostro sito Web, accetti il nostro utilizzo dei cookie.",
        'en': "To make the website user experience as easy and personal as possible, we make use of cookies. We also use them to ensure we and third parties can serve advertisements that are relevant to you. By using our website, you accept our use of cookies."
      },
      buttons:{
        agree:{
          //'it': "Accetto tutti",
          'it': 'Accetto',
          'en': "I Agree"
        },
        //settings:"Change cookie settings"
        settings:"More Info"
      }
    };
    this.init();
  }

  init(){

    var self = this;
    if(this.debug){
      this.deleteAllCookies();
      this.destroyBanner();
      return false;
    }
    if(window.workers.page == 'cookies'){
      this.destroyBanner();
    }
    if(!this.getCookie("pixelmultimedia_all") && !this.getCookie("pixelmultimedia_custom")){
      if(!window.workers.checkElement("#cookie_preferences") && !window.workers.checkElement("#cookies_banner")){
        this.createBanner();
      }
    }else{
      var obj = JSON.parse(this.getCookie("pixelmultimedia_all") || this.getCookie("pixelmultimedia_custom"));
      this.status = obj;
      if(window.workers.checkElement("#cookie_preferences")){
        for (var prop in obj) {
          if(window.workers.$s("#"+prop))
          window.workers.$s("#"+prop).checked = obj[prop];
        }
      }
    }

    this.initEvents();

  }

  initEvents(){

    var self = this;

    if(window.workers.checkElement("#cookies_ok")){
      var ok_cookies = window.workers.$s("#cookies_ok");

      ok_cookies.onclick = function(){
        self.okAllCookies();
        self.destroyBanner();
      };

      var cookies_settings = window.workers.$s("#cookies_settings");
      cookies_settings.onclick = function(){
        self.destroyBanner();
      };

    }
  }

  createBanner(){

    this.destroyBanner();

    var cookies_page_link = (this.lang != window.workers.main_language) ? '/'+this.lang+'/cookie-policy/' : '/cookie-policy/';
    var cookie_banner_info = document.getElementById("cookie-banner-info");

    var html = '<div class="container-fluid">'
    +'<div class="row">'
    +'<div class="col-8 desc">'
    //+'<p>'+this.text.paragraph[this.lang]+'</p>'
    + '<p>' + cookie_banner_info.dataset.paragraph + '</p>'
    +'</div>'
    +'<div class="col-4 w_buttons">'
    +'<div class="w-btn">'
    +'<a id="cookies_settings" href="'+cookies_page_link+'" class="button yellow" data-target="cookie policy">'
    //+'<span>'+this.text.buttons.settings+'</span>'
    + '<span>' + cookie_banner_info.dataset.moreinfo + '</span>'
    +'</a>'
    +'</div>'
    +'<div class="w-btn">'
    +'<a id="cookies_ok" class="button yellow" data-target="cookie policy">'
    //'<span>'+this.text.buttons.agree[this.lang]+'</span>'
    + '<span>' + cookie_banner_info.dataset.iagree + '</span>'
    +'</a>'
    +'</div>'
    // +'<a id="cookies_settings" class="button inverse" href="'+cookies_page_link+'"><span>'+this.text.buttons.settings+'</span></a>'
    // +'<a id="cookies_ok" class="button inverse"><span>'+this.text.buttons.agree[this.lang]+'</span></a>'
    +'</div>'
    +'</div>'
    +'</div>';

    var body = window.workers.$body;

    var tmpDiv = document.createElement('div');
    tmpDiv.id = 'cookies_banner';
    tmpDiv.classList.add('container_fluid');
    tmpDiv.classList.add('cookies');
    tmpDiv.classList.add('banner');
    tmpDiv.innerHTML = html;
    body.appendChild(tmpDiv);

  }

  destroyBanner(){
    if(window.workers.checkElement("#cookies_banner")){
      var c_b = window.workers.$s("#cookies_banner");
      if(window.workers.$isIE){
        window.workers.$body.removeChild(c_b);
      }else{
        c_b.remove();
      }
    }
  }

  okAllCookies(){
    this.status.functional = true;
    this.status.analytics = true;
    this.status.socials = true;
    this.status.adv = true;
    this.status.other = true;
    this.setCookie('pixelmultimedia_all', this.status, this.duration);
  }

  setCookie(name,value,duration){
    Cookies.set(name, value, {expires: duration});
  }

  getCookie(name){
    return Cookies.get(name);
  }

  deleteCookie(name){
    Cookies.remove(name);
  }

  deleteAllCookies(){
    this.deleteCookie('pixelmultimedia_all');
    this.deleteCookie('pixelmultimedia_custom');
  }

};
