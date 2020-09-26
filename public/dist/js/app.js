(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.App = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var _cookiesManager = require('./modules/cookiesManager');

var app = new Vue({
  el: '#app-root',
  data: {
    slider: null,
    sliderContainer: '.swiper-container',
    html: document.querySelector('html'),
    navLinks: document.querySelectorAll('nav ul li a')
  },
  //beforeCraete:
  created: function created() {
    var _this = this;

    // hide loader

    // check cookie 
    var cookies = new _cookiesManager.CookiesManager();

    // nav link animation
    for (var i = 0; i < this.navLinks.length; i++) {
      this.navLinks[i].addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        _this.navLinkClick(e);
      });
    }

    // connect animation items

    // addEventListener window scroll
    window.addEventListener('scroll', this.handleScroll);

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
    handleScroll: function handleScroll(e) {
      var offset = 60;
      if (window.pageYOffset >= offset) {
        this.html.classList.add('changed');
      } else {
        this.html.classList.remove('changed');
      }
    },
    navLinkClick: function navLinkClick(e) {
      var offset = 60;
      var href = e.target.href;
      var targetId = href.split('#')[1];
      var target = document.querySelector('#' + targetId);
      anime({
        targets: 'html, body',
        scrollTop: target.offsetTop - offset,
        duration: 500,
        easing: 'easeInOutQuad'
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
        en: 'Our website uses cookies to improve your experience. To find out more about the cookies we use please see our Cookies Policy.'
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

        ok_cookies.onclick = function () {
          self.okAllCookies();
          self.destroyBanner();
        };
      }
    }
  }, {
    key: 'createBanner',
    value: function createBanner() {
      this.destroyBanner();
      var cookie_banner_info = document.getElementById('cookie-banner-info');

      var html = '<div class="container-fluid">' + '<div class="row">' + '<div class="col wrapper-txt">' + '<p>' + this.text.paragraph.en + '</p>' + '</div>' + '<div class="col wrapper-btn">' + '<div class="btn solid dark">' + '<div class="bg"></div>' + '<a href="#" id="cookies_ok">' + this.text.buttons.agree.en + '</a>' + '</div>' + '</div>' + '</div>' + '</div>';

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
        if (window.workers.$isIE) {
          window.workers.$body.removeChild(c_b);
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
