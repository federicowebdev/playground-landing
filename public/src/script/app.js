import { CookiesManager } from './modules/cookiesManager';

const app = new Vue({
  el: '#app-root',
  data: {
    slider: null,
    sliderContainer: '.swiper-container',
    html: document.querySelector('html'),
    navLinks: document.querySelectorAll('nav ul li a'),
    form: {
      name: {
        value: null,
        class: '',
      },
      lastName: {
        value: null,
        class: '',
      },
      email: {
        value: null,
        class: '',
      },
      message: {
        value: null,
        class: '',
      },
      errors: [],
      alert: {
        class: 'form-alert',
      },
    },
    tabs: {
      data: null,
    },
  },
  mounted: function () {
    // hide loader

    this.getTab(1);
    // check cookie
    const cookies = new CookiesManager();

    // connect animation items

    // addEventListener window scroll
    window.addEventListener('scroll', this.handleScroll);

    // Swiper slider init
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
    navLinkClick(e) {
      e.preventDefault();
      let offset = 60;
      let href = e.target.href;
      let targetId = href.split('#')[1];
      let target = document.querySelector('#' + targetId);
      anime({
        targets: 'html, body',
        scrollTop: target.offsetTop - offset,
        duration: 500,
        easing: 'easeInOutQuad',
      });
    },
    validateEmail: function (email) {
      var re = /\S+@\S+\.\S+/;
      return re.test(email);
    },
    submitMessage: function (e) {
      e.preventDefault();
      e.stopPropagation();

      this.form.errors = [];

      if (
        !this.form.email.value ||
        this.form.email.value.trim() == '' ||
        !this.validateEmail(this.form.email.value)
      ) {
        this.form.errors.push('Email required!');
        this.form.email.class = 'has-error';
      }

      if (!this.form.message.value || this.form.message.value.trim() == '') {
        this.form.errors.push('Message required!');
        this.form.message.class = 'has-error';
      }

      if (!this.form.errors.length) {
        this.form.errors.push('Message send successful!');
        this.form.alert.class = 'form-alert success';
        return true;
      }

      this.form.alert.class = 'form-alert error';
    },
    removeFormErrors: function () {
      this.form.errors = [];
      this.form.email.class = '';
      this.form.message.class = '';
    },
    checkTab: function (e) {
      e.preventDefault();
      e.stopPropagation();
      // show loader tabs
      this.getTab(e.target.dataset.id);
    },
    getTab: function (id) {
      axios
        .get('/api/v1/tabs/' + id)
        .then((res) => {
          this.tabs.data = res.data.tab.content.join(' ');
          // remove loader tabs
        });
    },
  },

  destroyed() {
    window.removeEventListener('scroll', this.handleScroll);
  },
});
