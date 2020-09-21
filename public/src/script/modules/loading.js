
export class Loading {

  constructor() {
    this.pageLoading = '.p_load';
    this.lazeImageLoad = '.l_load';
    this.pageInitTiming = 200;
    //this.fakeTiming = 400;
    this.$html = window.workers.$html;
    this.p_load_state = false;
    //this.init();
  }

  init() {
    //if(!window.workers.isAjaxNav && window.menu.currentPage == 'home'){
    //this.lazyLoad();
    //}
    //else{
    this.pageLoad();
    //}
  }

  start() {

    window.sliders.clearIntervalProgress();

    this.$html.classList.remove("products-menu-show");

    if (window.menu.isOpen) {
      window.menu.close();
      //setTimeout(()=>{
      // this.$html.classList.remove("page-loaded");
      // this.$html.classList.add("page-loading");
      //}, 300);
      //return;
    }

    this.$html.classList.remove("page-loaded");
    this.$html.classList.add("page-loading");

  }

  progress() {
    /* non passo */
    this.$html.classList.add("page-full-loading");
  }

  pageLoad() {
    //window.menu.close();
    this.p_load_state = true;
    this.pageLoaded = imagesLoaded(this.pageLoading, { background: true });
    var self = this;
    this.lazyLoad();
    if (this.pageLoaded.elements.length > 0) {
      // this.pageLoaded.on( 'progress', function( instance, image ) {
      //   var result = image.isLoaded ? 'loaded' : 'broken';
      //   console.log( 'image is ' + result + ' for ' + image.img.src );
      // });
      this.pageLoaded.on('done', function (instance) {
        self.finish();
      });
    } else {
      this.finish();
    }

  }

  lazyLoad() {
    this.lazyImgLoad = imagesLoaded(this.lazeImageLoad);
    if (this.lazyImgLoad.elements.length > 0) {
      this.lazyImgLoad.on('progress', function (instance, image) {
        if (image.isLoaded) {
          var id = null;
          var parent = image.img.parentElement;
          if (parent) {
            var thumb = parent.querySelectorAll(".thumbnail");
            if (thumb.length > 0) {
              setTimeout(() => {
                if (window.workers.$isIE) {
                  parent.removeChild(thumb[0]);
                } else {
                  thumb[0].remove();
                }
              }, 800);
            }
          }
          image.img.classList.add('loaded');
        }
      });
    }
    if (!this.p_load_state)
      this.finish();
  }

  // lazyLoad(){
  //   this.lazyImgLoad = imagesLoaded(this.lazeImageLoad);
  //   if(this.lazyImgLoad.elements.length > 0){
  //     this.lazyImgLoad.on('progress', function(instance,image) {
  //       if(image.isLoaded){
  //         image.img.classList.add('loaded');
  //       }
  //     });
  //   }
  // }

  finish() {

    window.app.init();

    setTimeout(() => {
      this.$html.classList.remove('page-loading');
      this.$html.classList.add("page-loaded");
    }, 250);
  }

  // pageLoading(pLoad){
  //   var t = this;
  //   this.loaded = imagesLoaded(pLoad);
  //   this.loaded.on( 'done', function(instance) {
  //     //t.theLoader.classList.add('gone');
  //   });
  // };

  // singleImageLoading(sImageLoad){
  //   this.imgLoad = imagesLoaded(sImageLoad);
  //   this.imgLoad.on( 'progress', function(instance,image) {
  //     if(image.isLoaded && !image.img.classList.contains('mep')){
  //       image.img.className = 'loaded';
  //     }
  //   });

  //imgLoad.on( 'always', function( instance ) {
  //   console.log('ALWAYS - all images have been loaded');
  // });

  // imgLoad.on( 'fail', function( instance ) {
  //   console.log('FAIL - all images loaded, at least one is broken');
  // });
  //};
};
