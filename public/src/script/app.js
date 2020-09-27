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
      errors: []
    }
  },
  //beforeCraete:
  created: function () {
    // hide loader

    // check cookie 
    const cookies = new CookiesManager();

    // nav link animation
    for (let i = 0; i < this.navLinks.length; i++) {
      this.navLinks[i].addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.navLinkClick(e);
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
    validateEmail: function(email){
      var re = /\S+@\S+\.\S+/;
      return re.test(email);
    },
    submitMessage: function(e){
      
      e.preventDefault();
      e.stopPropagation();

      this.form.errors = [];

      if(!this.form.email.value || !this.form.email.value.trim() == '' || !this.validateEmail(this.form.email.value)){
        this.form.errors.push("Email required!");
        this.form.email.class = 'has-error';
      }

      if(!this.form.message.value || !this.form.message.value.trim() == ''){
        this.form.errors.push("Message required!");
        this.form.message.class = 'has-error';
      }

      if (!this.form.errors.length) {
        return true;
      }     

    },
    removeFormErrors: function(){
      this.form.errors = [];
      this.form.email.class = '';
      this.form.message.class = '';
    }
  },

  destroyed() {
    window.removeEventListener('scroll', this.handleScroll);
  },
});
