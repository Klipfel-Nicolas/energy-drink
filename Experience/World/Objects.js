import * as THREE from 'three'
import Experience from '../Experience';

export default class Objects {
    constructor() {

        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.debug = this.experience.debug;
    }

    /**
     * 
     * @param {*} geometry 
     * @param {*} material 
     */
    addMeshObject(geometry, material) {

        this.object = new THREE.Mesh(geometry, material);
        this.scene.add(this.object)

        this.object.castShadow = this.object.receiveShadow = true;
        this.experience.updateAllMaterials(true, true) 
    }

    /**
     * 
     * @param {THREE.geometry} geometry 
     * @param {THREE.material} material 
     */
    addParticlesObject(geometry, material) {
        this.object = new THREE.Points(geometry, material);
        this.scene.add(this.object)
    }

    /**
     * 
     * @param {String} name 
     */
    addObjectDebug(name) {
        if(this.debug.active) {
            this.debugName = name;
            this.debugObject = this.debug.debugFolderObject.addFolder(`${this.debugName}`)

            // Position

            this.debugPositionObject = this.debugObject.addFolder(`${this.debugName} position`)
            this.debugPositionObject.add(this.object.position, 'x').min(- 25).max(50).step(.1).name('object-X').listen();
            this.debugPositionObject.add(this.object.position, 'y').min(- 25).max(50).step(.1).name('object-Y').listen();
            this.debugPositionObject.add(this.object.position, 'z').min(- 25).max(50).step(.1).name('object-Z').listen();
            
            // Rotation
            this.debugRotationObject = this.debugObject.addFolder(`${this.debugName} rotation`)
            this.debugRotationObject.add(this.object.rotation, 'x').min(-Math.PI).max(Math.PI).step(.1).name('rot-X').listen();
            this.debugRotationObject.add(this.object.rotation, 'y').min(-Math.PI).max(Math.PI).step(.1).name('rot-Y').listen();
            this.debugRotationObject.add(this.object.rotation, 'z').min(-Math.PI).max(Math.PI).step(.1).name('rot-Z').listen();

            // Scale
            this.debugScaleObject = this.debugObject.addFolder(`${this.debugName} scale`)
            this.debugScaleObject.add(this.object.scale, 'x').min(0).max(10).step(.01).name('sca-X').listen();
            this.debugScaleObject.add(this.object.scale, 'y').min(0).max(10).step(.01).name('sca-Y').listen();
            this.debugScaleObject.add(this.object.scale, 'z').min(0).max(10).step(.01).name('sca-Z').listen();
        }
    }
}