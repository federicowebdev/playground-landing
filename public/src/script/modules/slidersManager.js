export class SlidersManager {

  constructor() {

  }

  init() {
    this.initElements();
    //this.initEvents();
  }

  initElements() {
    this.sliders = {};
    this.sliders.hero = null;
    var self = this;
    this.progress_bar = null;
    this.width = 0;
    this.state = false;

    if (window.workers.checkElement(".swiper-container.hero")) {

      this.sliders.hero = new Swiper('.swiper-container.hero', {
        slidesPerView: 1,
        centeredSlides: true,
        //spaceBetween: '5%',
        speed: 500,
        pagination: {
          el: '.swiper-pagination',
          type: 'fraction',
        },

        allowTouchMove: false,

        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        on: {
          click: function (e) {
            // if (self.state) {
            //   return;
            // }
            if (window.workers.checkElement(".swiper-container.hero")) {
              if(window.innerWidth > 991){
                if (e.target.classList.contains("swiper-button-next") || e.target.classList.contains("swiper-button-prev")) {
                  self.stopInterval();
                }
              }
              
            }
          },
          // slideChangeTransitionStart: function () {
          //   self.state = true;
          // },
          // slideChangeTransitionEnd: function () {
          //   self.state = false;
          // }
        }
      });
      this.progress_bar = window.workers.$s("#hero-slider-progress");
      this.width = 0;
      this.indexEndInterval = 0;
      this.indexStartInterval = 0;
      if(window.innerWidth > 991){
      this.startInterval();
    }
    }

    if (window.workers.checkElement(".swiper-container.sector")) {
      this.sliders.hero = new Swiper('.swiper-container.sector', {
        slidesPerView: 'auto',
        //loopedSlides: 4,
        centeredSlides: true,
        spaceBetween: 50,
        initialSlide: 1,
        speed: 400,
        //autoHeight: true,
        //loop: true,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      });
    }
  }

  startInterval() {
    var self = this;
    var timer = 10000;
    var interval = timer / 100;
    this.slider_hero_interval = setInterval(() => {
      self.progressBarSliderHero();
    }, interval);
  }

  clearIntervalProgress() {
    if (window.workers.checkElement(".swiper-container.hero")) {
      clearInterval(this.slider_hero_interval);
      this.progress_bar.style.width = '0';
      this.width = 0;
      this.indexStartInterval = 0;
      this.indexEndInterval = 0;
      this.slider_hero_interval = null;
      self.state = false;
      this.sliders.hero.destroy();
    }
  }

  stopInterval() {
    clearInterval(this.slider_hero_interval);
    this.progress_bar.style.width = '0';
    this.width = 0;
    this.indexStartInterval = 0;
    this.indexEndInterval = 0;
    this.slider_hero_interval = null;
    this.startInterval();
  }

  progressBarSliderHero() {
    if (!window.workers.checkElement(".swiper-container.hero")) {
      return;
    }
    this.progress_bar.style.width = this.width + '%';
    if (this.width >= 95 && this.width < 100) {
      this.progress_bar.style.width = '100%';
      this.width = 100;
    } else {
      if (this.width >= 100) {
        if (this.indexEndInterval >= 5) {
          this.stopInterval();
          if (this.sliders.hero.isEnd) {
            this.sliders.hero.slideTo(0);
          } else {
            this.sliders.hero.slideNext();
          }
        }
        else {
          this.indexEndInterval++;
        }

      } else {
        if (this.width == 0) {
          if (this.indexStartInterval >= 6) {
            this.width++;
          }
          else {
            this.indexStartInterval++;
          }
        } else {
          this.width++;
          this.progress_bar.style.width = this.width + '%';
        }

      }
    }

  }

  initEvents() {
  }

};
