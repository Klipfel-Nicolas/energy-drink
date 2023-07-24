import * as THREE from 'three'
import Experience from '../Experience';
import { EventEmitter } from "events";

import Environment from '../Scene/Environement';
import Models from './Models';
import ShadowFloorCustom from './ShadowFloorCustom';
import ScrollTriggerSketch from '../Sketches/ScrollTriggerSketch';


export default class World extends EventEmitter {
    constructor() {
        super();

        this.experience = new Experience();
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;
        this.camera = this.experience.camera;
        this.resources = this.experience.resources;
        this.debug = this.experience.debug;

        // Start world (on ressource ready)
        this.resources.on("ready", ()=> {
            this.environment = new Environment();

            // Add two scene to handle overscroll both models
            this.splitScenes();

            // Floor
            this.customShadowedFloor = new ShadowFloorCustom(this.scene);

            

            // Models
            this.models = {}
            this.monsterZero = new Models(this.resources.items.monster_zero.scene, this.scenes.first, 'm-zero');
            this.models['mzero'] = this.monsterZero.model;
            
            this.monsterOriginal = new Models(this.resources.items.monster.scene, this.scenes.second, 'm-original');
            this.models['moriginal'] = this.monsterOriginal.model;

            Object.values(this.models).forEach(model => {
                model.position.y = .3;
                model.position.z = 1.4;
                model.rotation.x = -1.5
                model.rotation.y = .1
                model.rotation.z = -.4
            })


            this.scrollTrigger = new ScrollTriggerSketch(this.models, this.views);
            this.scrollTrigger.setupAnimation();
            

            this.emit("worldready");
        }); 
        
    }

    /**
     * 
     * @param {number} geometryX 
     * @param {number} geometryZ 
     * @param {*} color 
     */
    setFloor(geometryX, geometryZ, color) {
        const geometry = new THREE.PlaneGeometry(geometryX, geometryZ);
        const material = new THREE.MeshStandardMaterial( {
            color: color,
            side: THREE.DoubleSide
        } );
        
        this.plane = new THREE.Mesh( geometry, material );
        this.plane.receiveShadow = true;
        this.plane.castShadow = false;
    
        
        this.scene.add( this.plane );
        this.plane.position.z = -2;

        // Position
        this.debugFloor = this.debug.debugFolderObject.addFolder(`floor`)

        this.debugFloor.add(this.plane.position, 'x').min(- 25).max(50).step(.1).name('object-X').listen();
        this.debugFloor.add(this.plane.position, 'y').min(- 25).max(50).step(.1).name('object-Y').listen();
        this.debugFloor.add(this.plane.position, 'z').min(- 25).max(50).step(.1).name('object-Z').listen();
    }

    /**
     * Split in multiple scene
     */
    splitScenes() {
        
        this.cameraTarget = new THREE.Vector3(0, 0, 0)
        
        this.scenes = {
            first: this.experience.scene,
            second: new THREE.Scene()
        }
        

        this.views = [
            {
                height: 1,
                bottom: 0,
                scene: this.scenes.first,
                camera: null,
            },
            {
                height: 0,
                bottom: 0,
                scene: this.scenes.second,
                camera: null,
            },
        ]

        //Create camera for both scene
        this.views.forEach((view, i) => {
            this.environment.addSunlight(view.scene, "#fff", 2, 2, 1.3, 3.2, `-${i}`, false)
            this.environment.addAmbiantLight(view.scene, 0xcccccc, .5,  `-${i}`)

            view.camera = this.camera.createPerspectiveCamera(0, 7, 0, i);
            this.camera.setOrbitControls(view.camera,this.canvas);
            view.scene.add(view.camera)
        })
        
    }

    //RESIZE
    resize() {
        if(this.views) {
            this.views.forEach(view => {
                view.camera.aspect = this.sizes.width / this.sizes.height;
                view.camera.updateProjectionMatrix();
            })
        }
    }

    //UPDATE
    update() {
        if(this.customShadowedFloor) {
            this.customShadowedFloor.update();
        }

        if(this.views) {
            this.views.forEach(view => {
                if(view.camera){
                    view.camera.lookAt(this.cameraTarget)
                
                    let bottom = this.sizes.height * view.bottom
                    let height = this.sizes.height * view.height
    
                    this.experience.renderer.renderer.setViewport(0, 0, this.sizes.width, this.sizes.height);
                    this.experience.renderer.renderer.setScissor(0, bottom, this.sizes.width, height);
                    this.experience.renderer.renderer.setScissorTest(true)
                    this.experience.renderer.renderer.render(view.scene, view.camera);
                }
            })
        }
    }
}