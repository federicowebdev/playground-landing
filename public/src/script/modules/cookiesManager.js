export class CookiesManager {
  constructor() {
    this._html = document.querySelector('html');
    this._body = document.querySelector('body');
    this.debug = false;
    this.setted = false;
    this.duration = 365; // 1 year
    this.status = {
      functional: true,
      analytics: true,
      socials: false,
      adv: false,
      other: false,
    };
    this.lang = 'en';
    this.text = {
      paragraph: {
        en:
          'Our website uses cookies to improve your experience. To find out more about the cookies we use please see our ',
      },
      buttons: {
        agree: {
          en: 'OK',
        },
      },
    };
    this.init();
  }

  init() {
    if (this.debug) {
      this.deleteAllCookies();
      this.destroyBanner();
      return false;
    }
    if (!this.getCookie('playground')) {
      this.createBanner();
    } else {
      var obj = JSON.parse(this.getCookie('playground'));
      this.status = obj;
    }

    this.initEvents();
  }

  initEvents() {
    var self = this;

    if (document.querySelector('#cookies_ok')) {
      var ok_cookies = document.querySelector('#cookies_ok');

      ok_cookies.onclick = function (e) {
        e.preventDefault();
        e.stopPropagation();
        self.okAllCookies();
        self.destroyBanner();
      };
    }
  }

  createBanner() {
    this.destroyBanner();

    var html =
      '<div class="container-fluid">' +
      '<div class="row">' +
      '<div class="col wrapper-txt">' +
      '<p>' +
      this.text.paragraph.en +
      '<a href="#">Cookies Policy</a>' +
      '</p>' +
      '</div>' +
      '<div class="col wrapper-btn">' +
      '<div class="btn solid dark">' +
      '<div class="bg"></div>' +
      '<a href="#" id="cookies_ok">' +
      this.text.buttons.agree.en +
      '</a>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '</div>';

    var body = document.querySelector('body');

    var tmpDiv = document.createElement('div');
    tmpDiv.id = 'cookies_banner';
    tmpDiv.classList.add('container_fluid');
    tmpDiv.classList.add('cookies');
    tmpDiv.classList.add('banner');
    tmpDiv.innerHTML = html;
    body.appendChild(tmpDiv);
  }

  destroyBanner() {
    if (document.querySelector('#cookies_banner')) {
      var c_b = document.querySelector('#cookies_banner');
      if (this._html.classList.contains('ie')) {
        this._body.removeChild(c_b);
      } else {
        c_b.remove();
      }
    }
  }

  okAllCookies() {
    this.status.functional = true;
    this.status.analytics = true;
    this.status.socials = true;
    this.status.adv = true;
    this.status.other = true;
    this.setCookie('playground', this.status, this.duration);
  }

  setCookie(name, value, duration) {
    Cookies.set(name, value, { expires: duration });
  }

  getCookie(name) {
    return Cookies.get(name);
  }

  deleteCookie(name) {
    Cookies.remove(name);
  }

  deleteAllCookies() {
    this.deleteCookie('playground');
  }
}
