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
      class: {
        active: 'btn solid grey active',
        flat: 'btn solid grey',
      },
      loader: {
        class: 'tab-loader show',
      },
    },
  },
  mounted: function () {
    // hide loader
    this.loaderManager();

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
    loaderManager() {
      setTimeout(() => {
        this.html.classList.add('show-app-loader');
      }, 250);

      setTimeout(() => {
        this.html.classList.add('remove-app-loader');
      }, 1300);

      setTimeout(() => {
        this.html.classList.add('slide-out-app-loader');
        setTimeout(() => {
          this.html.classList.remove('show-app-loader');
          this.html.classList.remove('remove-app-loader');
        }, 500);
      }, 1450);
    },
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
    removeFormErrors: function () {
      this.form.errors = [];
      this.form.email.class = '';
      this.form.message.class = '';
    },
    checkTab: function (e) {
      e.preventDefault();
      e.stopPropagation();
      // show loader tabs
      this.tabs.loader.class = 'tab-loader show';
      let tabLinks = document.querySelectorAll('.tabs-link .btn');
      for (let i = 0; i < tabLinks.length; i++) {
        tabLinks[i].classList.remove('active');
      }
      let parent = e.target.closest('.btn');
      parent.classList.add('active');
      this.getTab(e.target.dataset.id);
    },
    getTab: function (id) {
      axios.get('/api/v1/tabs/' + id).then((res) => {
        // remove loader tabs
        setTimeout(() => {
          this.tabs.loader.class = 'tab-loader';
          this.tabs.data = res.data.tab.content.join(' ');
        }, 1500);
      });
    },
  },

  destroyed() {
    window.removeEventListener('scroll', this.handleScroll);
  },
});
