import * as THREE from 'three'
import Experience from '../Experience';
import { EventEmitter } from "events";

import Environment from '../Scene/Environement';
import Models from './Models';
import ShadowFloorCustom from './ShadowFloorCustom';


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

            // Floor
            this.customShadowedFloor = new ShadowFloorCustom();

            // Monster Zero
            this.monsterZero = new Models(this.resources.items.monster_zero.scene);
            this.monsterZero.model.position.y = -1.5;
            this.monsterZero.model.rotation.z = -.3;

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

    //RESIZE
    resize() {
    }

    //UPDATE
    update() {
        
        if(this.customShadowedFloor) {
            this.customShadowedFloor.update();
        }
    }
}