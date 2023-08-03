/* eslint-disable no-unused-vars */
import {gsap} from 'gsap';
import {splitText} from '../utils/tools';


export default class Page {
  constructor() {
    this.page = document.querySelector("#app");
    this.sectionListElements = document.querySelectorAll('.toolTip');
    this.sectionListTitle = document.querySelectorAll('.toolTip > div');

    this.sectionTitle = document.querySelectorAll('[data-animation="title"]')
    
    splitText(this.sectionListTitle);
    splitText(this.sectionTitle);

    this.scrollSections = {
      isScrolling: false,
      currentSection: 0,
    }

    // Nav dots
    this.navDotsSection = {
      current: this.sectionListElements[this.scrollSections.currentSection]
    }
    this.handleToolTipActiveClass();

    this.addEventListeners();

    //Gsap Animations
    this.sectionOneAnimation();
    this.sectionTwoAnimation();
    this.sectionThreeAnimation();

  }

  /**
   * Get the scroll position percent
   */
  getScrollPercent() {
    let h = document.documentElement, 
        b = document.body,
        st = 'scrollTop',
        sh = 'scrollHeight';
        
    return (h[st]||b[st]) / ((h[sh]||b[sh]) - h.clientHeight) * 100;
  }

  /**
   * Handle current active nav dot
   */
  handleToolTipActiveClass() {
    let currentActiveElement = document.querySelector('.toolTip.active');
    if(currentActiveElement) currentActiveElement.classList.remove('active')

    this.navDotsSection.current = this.sectionListElements[this.scrollSections.currentSection]
    this.navDotsSection.current.classList.add('active')
  }


   /**
   * Gsap scrollTo animation
   */
   scrollToAnimation() {

    this.scrollSections.isScrolling = true;
    this.handleToolTipActiveClass();

    gsap.to(
      window, 
      { 
          duration: 1, 
          scrollTo:`#section${this.scrollSections.currentSection}`, 
          onComplete: () => {
              this.scrollSections.isScrolling = false;  
          } 
      }
    );
  }

  //SECTION GSAP ANIMATION

  /**
   * Section 1
   */
  sectionOneAnimation() {
    //Title
    const sectionTitle = document.querySelector('#section1 [data-animation="title"]')
    sectionTitle.querySelectorAll('span').forEach(char => {
      gsap.from(char, {
           scrollTrigger: {
               trigger: char,
           },
           duration: .8,
           delay: gsap.utils.random(.3, .5),
           autoAlpha: 0,
           x:-100
      }) 
    }) 

    //Paragraph
    gsap.from("#section1 p", {
      scrollTrigger: {
          trigger: "#section1 p",
      },
      duration: .8,
      delay: .6,
      autoAlpha: 0,
      x:-40
    })
  }

  /**
   * Section 2
   */
  sectionTwoAnimation() {
    //Title
    const sectionTitle = document.querySelectorAll('#section2 [data-animation="title"]')
    sectionTitle.forEach(title => {
      title.querySelectorAll('span').forEach(char => {
        gsap.from(char, {
            scrollTrigger: {
                trigger: char,
            },
            duration: .8,
            delay: gsap.utils.random(.1, .4),
            autoAlpha: 0,
            y:50
        }) 
      }) 
    })

    //Paragraph
    gsap.from("#section2 p", {
      scrollTrigger: {
          trigger: "#section2 p",
      },
      duration: .8,
      delay: .8,
      autoAlpha: 0,
      y:-40
    })
  }

  /**
   * Section 3
   */
  sectionThreeAnimation() {
    //Left Side
    gsap.from("#section3 .left-side li .h3", {
      scrollTrigger: {
          trigger: "#section3 .left-side li",
      },
      duration: .8,
      delay: .8,
      autoAlpha: 0,
      x:100
    })

    gsap.from("#section3 .left-side li .info", {
      scrollTrigger: {
          trigger: "#section3 .left-side li",
      },
      duration: .8,
      delay: 1.5,
      autoAlpha: 0,
    })

    //Right Side
    gsap.from("#section3 .right-side li .h3", {
      scrollTrigger: {
          trigger: "#section3 .right-side li",
      },
      duration: .8,
      delay: .8,
      autoAlpha: 0,
      x:-100
    })

    gsap.from("#section3 .right-side li .info", {
      scrollTrigger: {
          trigger: "#section3 .right-side li",
      },
      duration: .8,
      delay: 1.5,
      autoAlpha: 0,
    })
  }

  // Events
  onResize() {
   
  }

  /**
   * On wheel event scroll up down section
   *  @param {Event} e 
  */ 
  onWheelSection(e) {

    if(this.scrollSections.isScrolling) return;
        
    
    if(e.deltaY > 0 && this.scrollSections.currentSection < 5) this.scrollSections.currentSection += 1;
    if(e.deltaY < 0 && this.scrollSections.currentSection > 0) this.scrollSections.currentSection -= 1;
    
    this.scrollToAnimation()
  }

  /**
   * On tooltip list element click
   * @param {Event} e 
   */
  onCLickSection(e) {
    if(e.target.dataset) {
      this.scrollSections.currentSection = parseInt(e.target.dataset.section);

      this.scrollToAnimation()
    }
    
  }

  /**
   * OnMouseEnter on nav dot
   */
  onNavDotHover(e) {
    if(e.target.classList.contains('hover') || e.target.classList.contains('active')) return;
    e.target.classList.add('hover');
  }

  /**
   * onMouseLeave on nav dot
   */
  onNavDotLeave(e) {
    if(e.target.classList.contains('hover')) e.target.classList.remove('hover');;
  }

  /**
   * Handle dinamic scroll distance
   */
  handleScrollDistance() {
    const scrollDist = document.querySelector('.scroll-distance');
    scrollDist.style.height = `${this.getScrollPercent()}%`
  }

  // Loop

  update() {
   
  }

  // Listeners

  addEventListeners() {
    this.onMouseWheelEvent = this.onWheelSection.bind(this);
    this.onListElementClick = this.onCLickSection.bind(this);
    this.onNavDotEnter = this.onNavDotHover.bind(this);
    this.onNavDotLeaved = this.onNavDotLeave.bind(this);
    this.onScroll = this.handleScrollDistance.bind(this);
    
    this.page.addEventListener('wheel', this.onMouseWheelEvent);
    document.addEventListener('scroll', this.onScroll);

    

    this.sectionListElements.forEach(element => {
      element.addEventListener('click', this.onListElementClick);
      element.addEventListener('mouseenter', this.onNavDotEnter);
      element.addEventListener('mouseleave', this.onNavDotLeaved);
    })
  }

  removeEventListeners() {}

  // Destroy

  destroy() {
  }
}
