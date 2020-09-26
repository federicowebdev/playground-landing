(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.App = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var app = new Vue({
  el: '#app-root',
  data: {
    slider: null,
    sliderContainer: '.swiper-container',
    html: document.querySelector("html")
  },
  //beforeCraete:
  created: function created() {
    // 1) hide loader

    // 2) connect animation items

    // 3) Swiper slider init
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

    // 4) addEventListener window scroll
    window.addEventListener('scroll', this.handleScroll);
  },

  methods: {
    handleScroll: function handleScroll(e) {
      var offset = 60;
      if (window.pageYOffset >= offset) {
        this.html.classList.add('changed');
      } else {
        this.html.classList.remove('changed');
      }
    }
  },

  destroyed: function destroyed() {
    window.removeEventListener('scroll', this.handleScroll);
  }
});

},{}]},{},[1])(1)
});
