(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.App = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var _cookiesManager = require('./modules/cookiesManager');

var app = new Vue({
  el: '#app-root',
  data: {
    slider: null,
    sliderContainer: '.swiper-container',
    html: document.querySelector('html'),
    navLinks: document.querySelectorAll('nav ul li a'),
    navOffset: 60,
    form: {
      name: {
        value: null,
        class: ''
      },
      lastName: {
        value: null,
        class: ''
      },
      email: {
        value: null,
        class: ''
      },
      message: {
        value: null,
        class: ''
      },
      errors: [],
      alert: {
        class: 'form-alert'
      }
    },
    tabs: {
      data: null,
      class: {
        active: 'btn solid grey active',
        flat: 'btn solid grey'
      },
      loader: {
        class: 'tab-loader show'
      }
    }
  },
  mounted: function mounted() {
    // hide loader
    this.loaderManager();

    this.getTab(1);
    // check cookie
    var cookies = new _cookiesManager.CookiesManager();

    // addEventListener window scroll
    window.addEventListener('scroll', this.handleScroll);
    this.handleScroll();
    // addEventListener window scroll
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
    // Swiper slider init
    this.slider = new Swiper(this.sliderContainer, {
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },
      // Navigation arrows
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      }
    });
  },

  methods: {
    loaderManager: function loaderManager() {
      var _this = this;

      setTimeout(function () {
        _this.html.classList.add('show-app-loader');
      }, 250);

      setTimeout(function () {
        _this.html.classList.add('remove-app-loader');
      }, 1300);

      setTimeout(function () {
        _this.html.classList.add('slide-out-app-loader');
        setTimeout(function () {
          _this.html.classList.remove('show-app-loader');
          _this.html.classList.remove('remove-app-loader');
        }, 500);
      }, 1450);
    },

    hambManager: function hambManager() {
      this.html.classList.toggle('mobile-menu-show');
    },
    handleScroll: function handleScroll(e) {
      var offset = 60;
      if (window.innerWidth >= 1024) {
        if (window.pageYOffset >= offset) {
          this.html.classList.add('changed');
        } else {
          this.html.classList.remove('changed');
        }
      }
    },
    handleResize: function handleResize(e) {
      if (window.innerWidth <= 1024) {
        this.navOffset = 50;
      }
    },
    navLinkClick: function navLinkClick(e) {
      var mobile = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      e.preventDefault();
      var offset = this.navOffset;
      var href = e.target.href;
      var targetId = href.split('#')[1];
      var target = document.querySelector('#' + targetId);
      if (mobile) {
        this.html.classList.remove('mobile-menu-show');
      }
      anime({
        targets: 'html, body',
        scrollTop: target.offsetTop - offset,
        duration: 500,
        easing: 'easeInOutQuad'
      });
    },

    validateEmail: function validateEmail(email) {
      var re = /\S+@\S+\.\S+/;
      return re.test(email);
    },
    submitMessage: function submitMessage(e) {
      e.preventDefault();
      e.stopPropagation();

      this.form.errors = [];

      if (!this.form.email.value || this.form.email.value.trim() == '' || !this.validateEmail(this.form.email.value)) {
        this.form.errors.push('Email required!');
        this.form.email.class = 'has-error';
      }

      if (!this.form.message.value || this.form.message.value.trim() == '') {
        this.form.errors.push('Message required!');
        this.form.message.class = 'has-error';
      }

      if (!this.form.errors.length) {
        this.form.errors.push('Message sent successful!');
        this.form.alert.class = 'form-alert success';
        this.form.name.value = null;
        this.form.lastName.value = null;
        this.form.email.value = null;
        this.form.message.value = null;
        return true;
      }

      this.form.alert.class = 'form-alert error';
    },
    removeFormErrors: function removeFormErrors() {
      this.form.errors = [];
      this.form.email.class = '';
      this.form.message.class = '';
    },
    checkTab: function checkTab(e) {
      e.preventDefault();
      e.stopPropagation();
      // show loader tabs
      this.tabs.loader.class = 'tab-loader show';
      var tabLinks = document.querySelectorAll('.tabs-link .btn');
      for (var i = 0; i < tabLinks.length; i++) {
        tabLinks[i].classList.remove('active');
      }
      var parent = e.target.closest('.btn');
      parent.classList.add('active');
      this.getTab(e.target.dataset.id);
    },
    getTab: function getTab(id) {
      var _this2 = this;

      axios.get('/api/v1/tabs/' + id).then(function (res) {
        // remove loader tabs
        setTimeout(function () {
          _this2.tabs.loader.class = 'tab-loader';
          _this2.tabs.data = res.data.tab.content.join(' ');
        }, 1500);
      });
    }
  },

  destroyed: function destroyed() {
    window.removeEventListener('scroll', this.handleScroll);
  }
});

},{"./modules/cookiesManager":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CookiesManager = exports.CookiesManager = function () {
  function CookiesManager() {
    _classCallCheck(this, CookiesManager);

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
      other: false
    };
    this.lang = 'en';
    this.text = {
      paragraph: {
        en: 'Our website uses cookies to improve your experience. To find out more about the cookies we use please see our '
      },
      buttons: {
        agree: {
          en: 'OK'
        }
      }
    };
    this.init();
  }

  _createClass(CookiesManager, [{
    key: 'init',
    value: function init() {
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
  }, {
    key: 'initEvents',
    value: function initEvents() {
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
  }, {
    key: 'createBanner',
    value: function createBanner() {
      this.destroyBanner();

      var html = '<div class="container-fluid">' + '<div class="row">' + '<div class="col wrapper-txt">' + '<p>' + this.text.paragraph.en + '<a href="#">Cookies Policy</a>' + '</p>' + '</div>' + '<div class="col wrapper-btn">' + '<div class="btn solid dark">' + '<div class="bg"></div>' + '<a href="#" id="cookies_ok">' + this.text.buttons.agree.en + '</a>' + '</div>' + '</div>' + '</div>' + '</div>';

      var body = document.querySelector('body');

      var tmpDiv = document.createElement('div');
      tmpDiv.id = 'cookies_banner';
      tmpDiv.classList.add('container_fluid');
      tmpDiv.classList.add('cookies');
      tmpDiv.classList.add('banner');
      tmpDiv.innerHTML = html;
      body.appendChild(tmpDiv);
    }
  }, {
    key: 'destroyBanner',
    value: function destroyBanner() {
      if (document.querySelector('#cookies_banner')) {
        var c_b = document.querySelector('#cookies_banner');
        if (this._html.classList.contains('ie')) {
          this._body.removeChild(c_b);
        } else {
          c_b.remove();
        }
      }
    }
  }, {
    key: 'okAllCookies',
    value: function okAllCookies() {
      this.status.functional = true;
      this.status.analytics = true;
      this.status.socials = true;
      this.status.adv = true;
      this.status.other = true;
      this.setCookie('playground', this.status, this.duration);
    }
  }, {
    key: 'setCookie',
    value: function setCookie(name, value, duration) {
      Cookies.set(name, value, { expires: duration });
    }
  }, {
    key: 'getCookie',
    value: function getCookie(name) {
      return Cookies.get(name);
    }
  }, {
    key: 'deleteCookie',
    value: function deleteCookie(name) {
      Cookies.remove(name);
    }
  }, {
    key: 'deleteAllCookies',
    value: function deleteAllCookies() {
      this.deleteCookie('playground');
    }
  }]);

  return CookiesManager;
}();

},{}]},{},[1])(1)
});
