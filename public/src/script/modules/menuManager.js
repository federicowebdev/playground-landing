
export class MenuManager {

  constructor(){
    //this.nav = null;
    this.hamb = null;
    this.li_a = null;
    this.isOpen = false;
    this.animTime = 450;
    this.currentPage = null;
    this.homeList = ['/','/en/','/fr/'];
    this.menuOpenClass = "main-menu-open";
    //this.init();
  }

  init(){

    //this.nav = window.workers.$s(".main-menu");
    this.li_a = window.workers.$(".main-nav li a");
    this.hamb = window.workers.$s(".hamb-menu");
    this.initEvents();
    this.setPage();
  }

  initEvents(){
    var self = this;
    /* gives the same results */
    // this.hamb.addEventListener("click", this.open.bind(this));
    this.hamb.addEventListener("click", () => this.menuState());
  }

  removeActive(){
    for(let i=0; i<this.li_a.length; i++){
      this.li_a[i].classList.remove("active");
      this.li_a[i].parentElement.classList.remove("active");
    }
  }

  setActive(dataAttr){
    for(let i=0; i<this.li_a.length; i++){
      if(this.li_a[i].dataset.target == dataAttr){
        this.removeActive();
        this.li_a[i].classList.add("active");
        this.li_a[i].parentElement.classList.add("active");
      }
    }
  }

  setPage(){

    for(let i = 0;i<this.li_a.length;i++){
      if(this.li_a[i].classList.contains('active'))
      this.currentPage = this.li_a[i].pathname.replace(/\//g, "");
    }

    if(window.location.pathname == '/privacy-policy/'){
      this.currentPage = 'privacy';
    }

    if(window.location.pathname == '/cookie-policy/'){
      this.currentPage = 'cookie';
    }

    if(this.homeList.includes(window.location.pathname))
    this.currentPage = 'home';

    window.workers.page = this.currentPage;
  }

  menuState(){

    if(!this.isOpen)
      this.open();
    else
      this.close();
  }

  open(){
    window.workers.$html.classList.add(this.menuOpenClass);
    this.isOpen = true;
    // document.body.addEventListener('touchmove', function(e){
    //   e.preventDefault();
    // }, false);

  }

  close(){
    window.workers.$html.classList.remove(this.menuOpenClass);
    this.isOpen = false;
  }

};
