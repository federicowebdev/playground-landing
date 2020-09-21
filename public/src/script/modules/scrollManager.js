
export class ScrollManager {

  constructor() {
    //this.init();
  }

  init() {

    var t = this;

    this.initElements();
    this.initEvents();

    for (let i = 0; i < this.elements.length; i++) {
      this.makeWatcher(this.elements[i]);
    }

    this.onScroll();

  }

  initElements() {
    this.elements = window.workers.$(".anim");
  }

  initEvents() {
    window.addEventListener("scroll", (e) => {
      this.onScroll(e);
    });
  }

  onScroll(e = null) {
    this.checkFilterSticky(e);
    this.checkLinkSticky(e);
    this.checkRelPos(e);
  }

  checkFilterSticky(e) {
    if (window.workers.checkElement(".bee-alive.filter-manager")) {
      var item = window.workers.$s(".bee-alive.filter-manager");
      var sticky = window.workers.$s(".bee-alive.filter-manager.fixed");
      var h = 70;
      var offset = item.offsetTop + item.offsetHeight - h;
      if (window.pageYOffset >= offset) {
        //sticky.classList.add("show");
        item.classList.add("fixed-after");
      } else {
        //sticky.classList.remove("show");
        item.classList.remove("fixed-after");
      }
    }
  }

  checkLinkSticky(e) {
    if (window.workers.checkElement(".link-system")) {
      var item = window.workers.$s(".link-system");
      var sticky = window.workers.$s(".sticky-link-system");
      var offset = item.offsetTop + item.offsetHeight;
      if (window.pageYOffset >= offset) {
        sticky.classList.add("show");
      } else {
        sticky.classList.remove("show");
      }
    }
  }

  checkRelPos(e) {
    if (window.workers.checkElement(".link-system")) {
      var sector_component = window.workers.$(".sector");
      var links = window.workers.$(".link");
      for (let i = 0; i < sector_component.length; i++) {
        if (sector_component[i].dataset.ref != undefined && sector_component[i].dataset.ref != '') {
          var offset = sector_component[i].offsetTop + sector_component[i].offsetHeight;
          if (window.pageYOffset >= (sector_component[i].offsetTop - 70) && window.pageYOffset <= offset) {
            for (let j = 0; j < links.length; j++) {
              if (sector_component[i].dataset.ref == links[j].dataset.rel) {
                links[j].classList.add("active");
              } else {
                links[j].classList.remove("active");
              }
            }
          }
        }
      }
    }
  }

  // checkHeader(e){
  //   if(window.workers.page == 'home' || window.workers.page == ''){
  //     if(window.pageYOffset >= window.innerHeight/10){
  //       window.workers.$html.classList.add("header_inverse");
  //     }else{
  //       window.workers.$html.classList.remove("header_inverse");
  //     }
  //   }
  // }

  makeWatcher(element) {
    var watcher = scrollMonitor.create(element);
    watcher.stateChange(this.showElement);
    watcher._this = this;
    this.showElement.call(watcher);
  }

  showElement() {

    var item = this.watchItem;

    if (!this.isInViewport)
      return;

    var logo = window.workers.$s(".logo");
    var header = window.workers.$s("header");
    var html = window.workers.$html;

    var y = (window.scrollY !== undefined) ? window.scrollY : (document.documentElement || document.body.parentNode || document.body).scrollTop;

    if (this.isBelowViewport || this.isFullyInViewport || this.isAboveViewport) {
      this._this.setAnimationAttributes(item);
      var anim_items = item.getElementsByClassName('anim_item');
      if (anim_items.length) {
        for (let i = 0; i < anim_items.length; i++) {
          this._this.setAnimationAttributes(anim_items[i]);
        }
      }

    }
  }

  setAnimationAttributes(item) {
    if (item.classList.contains("animated")) {
      return;
    }
    let delay = item.getAttribute("data-delay");
    let velocity = item.getAttribute("data-velocity");
    let animation = item.getAttribute("data-anim");
    if (!delay && !velocity && !animation) {
      return;
    }
    this.addVelocity(item, velocity);
    this.addDelay(item, delay);
    this.addAnimation(item, animation);
    item.classList.add("animated");
    item.removeAttribute("data-delay");
    item.removeAttribute("data-velocity");
    item.removeAttribute("data-anim");
  }

  addAnimation(element, attr) {

    if (!attr)
      return;

    element.classList.add(attr);
  }

  addDelay(element, attr) {

    if (!attr)
      return;

    element.style['transition-delay'] = attr;
    element.style['-webkit-transition-delay'] = attr;
    element.style['-o-transition-delay'] = attr;
  }

  addVelocity(element, attr) {

    if (!attr)
      return;

    element.style['transition-duration'] = attr;
    element.style['-webkit-transition-duration'] = attr;
    element.style['-o-transition-duration'] = attr;
  }

};
