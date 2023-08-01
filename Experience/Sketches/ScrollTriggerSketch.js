import Experience from '../Experience';
import { EventEmitter } from "events";
import {gsap} from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { ScrollTrigger} from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(ScrollToPlugin);


export default class ScrollTriggerSketch extends EventEmitter {
    constructor(models, views) {
        super();
        this.experience = new Experience;
        this.shadow = this.experience.world.customShadowedFloor.floor;

        this.models = models;
        this.views = views

        this.PI = Math.PI;

    }

    setupAnimation() {

        //Only for array (multiple items)
        this.cameras = {position: [this.views[0].camera.position, this.views[1].camera.position]}

        this.models = {
            position: [this.models.mzero.position, this.models.moriginal.position],
            rotation: [this.models.mzero.rotation, this.models.moriginal.rotation],
        }


        //ScrollTrigger.matchMedia({})
        gsap.matchMedia({"(prefers-reduced-motion: no-preference)": this.desktopAnimation()})
    }

    desktopAnimation() {
        let section = 0;

        const tl = gsap.timeline({
            defaults: {
                duration: 1,
                ease: "power2.inOut"
            },
            scrollTrigger: {
                trigger: ".page",
                start: "top top",
                end: "bottom bottom",
                scrub: .5, //Smoother animation
                snap: 1/5, // Auto scroll dived
                markers: true,
                onUpdate: () => {
                }
            }
        })

        tl.to(this.models.rotation, {x: 0, ease: "power2.out" }, section)
        tl.to(this.models.rotation, {y: Math.PI * 2 + .5, ease: "power1.in"}, section)
        tl.to(this.models.rotation, {z: 0 , ease: "power2.out"}, section)
        
        tl.to(this.models.position, {x: -2/* , ease: "power2.in" */}, section)
        tl.to(this.models.position, {y: -2/* , ease: "power2.in" */}, section)
        tl.to(this.models.position, {z: 0/* , ease: "power2.in" */}, section)

        tl.to(this.cameras.position, {y: 0/* , ease: "power2.in" */}, section)
        tl.to(this.cameras.position, {z:5.5/* , ease: "power2.in" */}, section)
        
        tl.to(this.shadow.position, {x:0/* , ease: "power2.in" */}, section)

        //Section 2
        section += 1
        tl.to(this.models.position, {y: 0 , ease: "power2.out" }, section)
        tl.to(this.models.position, {z: .9, ease: "power2.in"}, section)
        tl.to(this.models.position, {x: .3/**/ , ease: "power2.in" }, section)

        tl.to(this.models.rotation, {x: -.3, ease: "power1.out"}, section)
        tl.to(this.models.rotation, {z: -.2, ease: "power2.in"}, section)
        
        //Section 3
         section += 1
        tl.to(this.models.position, {y: -2, ease: "power1.in"}, section)
        tl.to(this.models.position, {x: -.3/* , ease: "power2.in" */ }, section)
        tl.to(this.models.position, {z: 1.4, ease: "power2.in"}, section)
        
        tl.to(this.models.rotation, {y: 3.1, ease: "power1.in"}, section)
        tl.to(this.models.rotation, {x: 0, ease: "power1.out"}, section)
        tl.to(this.models.rotation, {z: 0, ease: "power1.out"}, section)
        
        //Section 4
        section += 1
        tl.to(this.models.rotation, {y: 0, ease: "power1.in"}, section)
        
        //Section 5
        section += 1
        tl.to(this.views[1], {height: 1, ease: 'linear'}, section)
    }



    //RESIZE
    resize() {
    }

    onWheel() {
       
    }

    //UPDATE
    update() {
    }
}