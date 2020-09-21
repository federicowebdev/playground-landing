
export class EventsManager {

  constructor() {
    this.debug = false;
    this.bee_alive_wall = null;
  }

  init() {
    this.initElements();
    this.initEvents();
  }

  initElements() {

    var self = this;

    this.hamb = window.workers.$s(".w_hamb .bg");
    this.sel_lang = window.workers.$s(".w_langs");

    if (window.workers.checkElement(".muuri-grid.active")) {
      this.initWallNews(window.workers.$s(".muuri-grid.active"));
    }

    if (window.workers.checkElement("#instafeeds")) {
      var w_instafeeds = window.workers.$s("#instafeeds");
      new InstagramFeed({
        'username': 'imielidigiorgiopoeta',
        'container': w_instafeeds,
        'display_profile': false,
        'display_biography': false,
        'display_gallery': true,
        'callback': null,
        'styling': false,
        'items': 4,
        'image_size': 480
        //'items_per_row': 4,
        //'margin': 1
      });

      //remove all instafeeds "a" title
      var a_link_feeds = null;
      setTimeout(() => {
        a_link_feeds = w_instafeeds.querySelectorAll("a");
        for (let i = 0; i < a_link_feeds.length; i++) {
          a_link_feeds[i].removeAttribute("title");
        }
      }, 500);

    }


  }

  initWallNews(element) {

    var self = this;

    if (this.bee_alive_wall) {
      this.bee_alive_wall.destroy();
    }

    var wall_news_grid = new Muuri(element, {

      // Default show animation
      showDuration: 200,
      showEasing: 'ease',

      // Default hide animation
      hideDuration: 200,
      hideEasing: 'ease',

      // Item's visible/hidden state styles
      visibleStyles: {
        opacity: '1',
        //transform: 'scale(1)'
      },
      hiddenStyles: {
        opacity: '0',
        //transform: 'scale(0.5)'
      },

      layoutDuration: 200,
      layoutOnResize: 100,

      layout: {
        fillGaps: true,
        horizontal: false,
        alignRight: false,
        alignBottom: false,
        rounding: false
      },
    });

    this.bee_alive_wall = wall_news_grid;

    this.bee_alive_wall.on('filter', function (shownItems, hiddenItems) {
      if (shownItems.length == 0) {
        self.bee_alive_wall._element.style.opacity = 0;
        self.bee_alive_wall._element.style.visibility = 'hidden';
        window.workers.$s(".filter-no-result").style.display = 'flex';
      } else {
        self.bee_alive_wall._element.style.opacity = 1;
        self.bee_alive_wall._element.style.visibility = 'visible'
        window.workers.$s(".filter-no-result").style.display = 'none';
      }
    });
  }

  initEvents() {

    var self = this;

    window.addEventListener('resize', (e) => {
      this.onResize(e);
    });

    window.dispatchEvent(new Event('resize'));

    if (window.workers.checkElement(".no-pjax")) {

      //var galleries = window.workers.$(".apiaries-internal.gallery .w-images");
      var g_lightbox = GLightbox({
        keyboardNavigation: true,
        autoplayVideos: false,
        loop: true,
        openEffect: 'fade',
        touchFollowAxis: true,
        closeEffect: 'none',
        videosWidth: '75%',
        svg: {
          //"close": "",
          "prev": '<svg version="1.1" id="Livello_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 300 300" style="enable-background:new 0 0 300 300;" xml:space="preserve"><path d="M98.3,251.5c3.8,4.5,10.5,5.1,15,1.4c4.5-3.8,5.1-10.5,1.4-15c-0.4-0.5-0.9-0.9-1.4-1.4l-76.5-76.6h253	c5.9-0.3,10.4-5.3,10.1-11.2c-0.3-5.5-4.6-9.8-10.1-10.1h-253L113.5,62c4-4.2,4-10.8,0-15c-4.1-4.1-10.8-4.2-15,0c0,0,0,0,0,0L3.7,141.8c-4.1,4-4.3,10.6-0.3,14.7c0.1,0.1,0.2,0.2,0.3,0.3L98.3,251.5z"/></svg>',
          "next": '<svg height="300px" width="300px"  fill="#000000" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 100 100" x="0px" y="0px"><title>Forward</title><path d="M67.34,15.9a3.55,3.55,0,1,0-5,5L87.85,46.44H3.53a3.56,3.56,0,0,0,0,7.11H87.85L62.3,79.06a3.62,3.62,0,0,0,0,5,3.53,3.53,0,0,0,5,0l31.6-31.6a3.47,3.47,0,0,0,0-5Z"></path></svg>'
        },
        plyr: {
          enabled: false,
          //['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'captions', 'settings', 'pip', 'airplay', 'fullscreen']
          controls: ['play', 'progress', 'current-time', 'mute', 'volume'],
          fullscreen: {
            enabled: false
          },
          previewThumbnails: {
            enabled: false
          }
        }
      });

      //console.log(g_lightbox);

      var no_ajax = window.workers.$(".no-pjax");

      for (var i = 0; i < no_ajax.length; i++) {
        no_ajax[i].addEventListener("click", function (e) {
          e.stopPropagation();
          e.preventDefault();
          return false;
        });
      }

    }


    //aggiungo evento per il tab sectors in home
    if (window.workers.checkElement(".home.tab-sectors")) {
      this.tab_links = window.workers.$(".tab-link");
      this.tab_contents = window.workers.$(".tab");
      for (let i = 0; i < this.tab_links.length; i++) {
        this.tab_links[i].addEventListener("click", (e) => {
          self.tabManager(e.target);
        });
      }
    }

    if (window.workers.checkElement(".link-system")) {
      this.links = window.workers.$(".link");
      for (let i = 0; i < this.links.length; i++) {
        this.links[i].addEventListener("click", (e) => {
          self.linkManager(e.target);
        });
      }
    }

    var smm = window.workers.$s(".sectors-mini-menu");

    smm.addEventListener("click", (e) => {
      self.productsMenuManager(e);
    });

    window.workers.$s(".products-filter").addEventListener("click", () => {
      self.productsMenuManager();
    });

    window.workers.$s("nav.main-menu .bg-filter").addEventListener("click", () => {
      window.menu.close();
    });

    if (window.workers.checkElement("#beealive-refresh")) {

      window.workers.$s("#beealive-refresh").addEventListener("click", function (e) {
        e.preventDefault();
        $.pjax.reload('#beealive-list');
      });

      $(document).on('pjax:complete', function () {

        // var pos = window.workers.$s(".bee-alive.list");
        // var offset = 70;

        // anime({
        //   targets: "html, body",
        //   scrollTop: pos.offsetTop - offset,
        //   duration: 500,
        //   easing: 'easeInOutQuad'
        // });

        window.scrollManager.init();

      });
    }

    if (window.workers.checkElement(".custom-select-wrapper")) {

      var custom_selects = window.workers.$('.custom-select-wrapper');

      for (let i = 0; i < custom_selects.length; i++) {

        custom_selects[i].addEventListener('click', function () {
          this.querySelector('.custom-select').classList.toggle('open');
        });

        for (var option of custom_selects[i].querySelectorAll(".custom-option")) {

          option.addEventListener('click', function () {

            if (!this.classList.contains('selected')) {

              this.parentNode.querySelector('.custom-option.selected').classList.remove('selected');
              this.classList.add('selected');
              this.closest('.custom-select').querySelector('.custom-select__trigger span').textContent = this.textContent;

              var pos = window.workers.$s(".bee-alive.filter-manager");
              var offset = 0;

              let value = this.textContent;
              var year_list = window.workers.$(".year-list");
              var filter_chip = window.workers.$(".filter-chip");

              window.workers.$s(".i-chips").dataset.year = value;

              for (let i = 0; i < year_list.length; i++) {

                if (year_list[i].dataset.date == value) {

                  for (let j = 0; j < filter_chip.length; j++) {
                    filter_chip[j].classList.remove("active");
                  }
                  year_list[i].classList.add("active");

                  self.initWallNews(year_list[i]);

                  anime({
                    targets: "html, body",
                    scrollTop: pos.offsetTop - offset,
                    duration: 500,
                    easing: 'easeInOutQuad'
                  });

                }
                else {
                  year_list[i].classList.remove("active");
                }
              }

              window.workers.$s(".filter-no-result").style.display = 'none';
              window.scrollManager.init();

            }
          });
        }

      }

      window.addEventListener('click', function (e) {

        for (let i = 0; i < custom_selects.length; i++) {

          var c_s = custom_selects[i].querySelector(".custom-select");

          if (!c_s.contains(e.target)) {
             c_s.classList.remove('open');
          }

        }
      });

    }


    if (window.workers.checkElement(".filter-chip")) {

      var filter_chip = window.workers.$(".filter-chip");

      for (let i = 0; i < filter_chip.length; i++) {

        filter_chip[i].addEventListener("click", function (e) {

          var pos = window.workers.$s(".bee-alive.filter-manager");
          var offset = 0;

          anime({
            targets: "html, body",
            scrollTop: pos.offsetTop - offset,
            duration: 150,
            easing: 'easeInOutQuad',
            complete: function(){


              if (e.target.classList.contains("active")) {
                e.target.classList.remove("active");
                //e.target.querySelector(".remove-filter").style.display = "none";
                self.bee_alive_wall.filter('.muuri-item');
                return;
              }
    
              let filter = e.target.dataset.filter;
    
              for (let j = 0; j < filter_chip.length; j++) {
                filter_chip[j].classList.remove("active");
              }
    
              e.target.classList.add("active");
              //e.target.querySelector(".remove-filter").style.display = "inline-block";
              self.bee_alive_wall.filter('.' + filter);
            }
          });

          

        });
      }
    }

    //document.addEventListener("mouseenter", (e)=>{});
    //document.addEventListener("mousemove", (e)=>{});
    //document.addEventListener("mouseleave", (e)=>{});

    if (window.workers.checkElement(".icon-share")) {
      var icons_share = window.workers.$(".icon-share");
      for (let i = 0; i < icons_share.length; i++) {
        icons_share[i].addEventListener("click", function (e) {
          var winWidth = 600;
          var winHeight = 600;
          var winTop = (window.innerHeight / 2) - (winHeight / 2);
          var winLeft = (window.innerWidth / 2) - (winWidth / 2);
          var a_link = e.target.querySelector("a");
          window.open(a_link.href, 'sharer', 'top=' + winTop + ',left=' + winLeft + ',toolbar=0,status=0,width=' + winWidth + ',height=' + winHeight);
        });
      }
    }

    if (window.workers.checkElement(".icon-play")) {

      window.workers.$s(".icon-play").addEventListener("click", () => {
        var panel = window.workers.$s(".video-beealive .w-video");
        panel.classList.add("show-video");
        var iframe = panel.querySelector("iframe");
        iframe.dataset.realurl = iframe.src;
        iframe.src += "?autoplay=1";
      });

      window.workers.$s(".w-close-video").addEventListener("click", () => {

        var panel = window.workers.$s(".video-beealive .w-video");
        var iframe = panel.querySelector("iframe");
        var iframe_src = iframe.dataset.realurl;
        iframe.src = '';

        setTimeout(function () {
          iframe.src = iframe_src;
        }, 500);
        panel.classList.remove("show-video");
      });

    }


  }

  onResize(e) {


  }

  productsMenuManager(e = null) {
    var smm = window.workers.$s(".sectors-mini-menu");
    //var spans = smm.querySelectorAll("span");
    var html = window.workers.$html;
    if (e == null) {
      html.classList.remove("products-menu-show");
      // spans[0].style.display = "block";
      // spans[1].style.display = "none";
      return;
    }
    html.classList.toggle("products-menu-show");
    // if (html.classList.contains("products-menu-show")) {
    //   spans[1].style.display = "block";
    //   spans[0].style.display = "none";
    // } else {
    //   spans[0].style.display = "block";
    //   spans[1].style.display = "none";
    // }
  }

  linkManager(target) {

    var id = target.dataset.rel;
    var offset = 0;
    if (id != 'section1') {
      if (window.innerWidth <= 1024) {
        offset = 56;
      } else {
        offset = 70;
      }
    }
    var pos = window.workers.$s("." + id);
    for (let i = 0; i < this.links.length; i++) {
      if (id == this.links[i].dataset.rel) {
        this.links[i].classList.add("active");
      } else {
        this.links[i].classList.remove("active");
      }
    }

    anime({
      targets: "html, body",
      scrollTop: pos.offsetTop - offset,
      duration: 500,
      easing: 'easeInOutQuad'
    });

    // if(window.workers.$html.classList.contains("android") && (window.workers.$html.classList.contains("mobile") || window.workers.$html.classList.contains("tablet"))){
    //   window.scroll(0, pos.offsetTop - offset);
    // }else{
    //   window.animator.scrollIt(
    //     pos,
    //     500,
    //     'easeOutQuart',
    //     () => { },
    //     offset
    //   );
    // }
  }

  tabManager(target) {

    //scroll page to tab system
    if (!window.workers.checkElement(".products.tab-sectors")) {
      var offset = 70;
      if (window.innerWidth <= 1024) {
        offset = 56;
      }

      anime({
        targets: "html, body",
        scrollTop: window.workers.$s(".home.tab-sectors").offsetTop - offset,
        duration: 500,
        easing: 'easeInOutQuad'
      });

      // if(window.workers.$html.classList.contains("android") && (window.workers.$html.classList.contains("mobile") || window.workers.$html.classList.contains("tablet"))){
      //   window.scroll(0, window.workers.$s(".home.tab-sectors").offsetTop - offset);
      // }
      // else{

      //   anime({
      //     targets: "html, body",
      //     scrollTop: window.workers.$s(".home.tab-sectors").offsetTop - offset,
      //     duration: 500,
      //     easing: 'easeInOutQuad'
      //   });
      //   //gsap.to(window, {duration: 500, scrollTo: {y: window.workers.$s(".home.tab-sectors").offsetTop, offsetY: offset}});
      //   // window.animator.scrollIt(
      //   //   window.workers.$s(".home.tab-sectors"),
      //   //   500,
      //   //   'easeOutQuart',
      //   //   () => { },
      //   //   offset
      //   // );
      // }

    }

    var rel = target.dataset.rel;
    var tab = window.workers.$s("#" + rel);
    for (let i = 0; i < this.tab_links.length; i++) {
      this.tab_links[i].classList.remove("active");
      this.tab_contents[i].classList.remove("active");
    }
    target.classList.add("active");
    tab.classList.add("active");
  }


};
