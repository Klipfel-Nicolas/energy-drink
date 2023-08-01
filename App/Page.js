/* eslint-disable no-unused-vars */
import {gsap} from 'gsap';
import {splitText} from '../utils/tools';


export default class Page {
  constructor() {
    this.page = document.querySelector("#app");
    this.sectionListElements = document.querySelectorAll('.toolTip');
    this.sectionListTitle = document.querySelectorAll('.toolTip > div');
    
    splitText(this.sectionListTitle);

    this.scrollSections = {
      isScrolling: false,
      currentSection: 0,
    }

    this.navDotsSection = {
      current: this.sectionListElements[this.scrollSections.currentSection]
    }
    this.handleToolTipActiveClass();

    this.addEventListeners();
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
    console.log('current section: ', this.scrollSections.currentSection)

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

  // Loop

  update() {
   
  }

  // Listeners

  addEventListeners() {
    this.onMouseWheelEvent = this.onWheelSection.bind(this);
    this.onListElementClick = this.onCLickSection.bind(this);
    this.onNavDotEnter = this.onNavDotHover.bind(this);
    this.onNavDotLeaved = this.onNavDotLeave.bind(this);
    
    this.page.addEventListener('wheel', this.onMouseWheelEvent);

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
