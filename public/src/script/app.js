const app = new Vue({
  el: '#app-root',
  data: {
    slider: null,
    sliderContainer: '.swiper-container',
    html: document.querySelector("html")
  },
  //beforeCraete:
  created: function () {
    // 1) hide loader

    // 2) connect animation items

    // 3) Swiper slider init
    this.slider = new Swiper(this.sliderContainer, {
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      // Navigation arrows
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });

    // 4) addEventListener window scroll
    window.addEventListener('scroll', this.handleScroll);
  },

  methods: {
    handleScroll(e) {
      const offset = 60;
      if (window.pageYOffset >= offset) {
        this.html.classList.add('changed');
      } else {
        this.html.classList.remove('changed');
      }
    },
  },

  destroyed() {
    window.removeEventListener('scroll', this.handleScroll);
  },
});
