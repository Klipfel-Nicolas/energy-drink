import Experience from '../Experience';

export default class Models {
    constructor(model, scene, name) {
        this.experience = new Experience();
        this.debug = this.experience.debug;
        
        this.scene = scene;
        this.model = model;
        this.modelName = name
        

        this.addModel(model);

    }

    /**
     * 
     * @param {Number} scaleX 
     * @param {Number} scaleY 
     * @param {Number} scaleZ 
     */
    addModel() {
        this.scene.add(this.model)
        this.experience.updateAllMaterials(true, true)

        //DEBUG
        if(this.debug.active) {
            this.debugModel = this.debug.debugFolderModel.addFolder(this.modelName)
            
            // Position
            this.debugPositionModel = this.debugModel.addFolder('position')
            this.debugPositionModel.add(this.model.position, 'x').min(- 10).max(10).step(.1).name('pos-X').listen();
            this.debugPositionModel.add(this.model.position, 'y').min(- 10).max(10).step(.1).name('pos-Y').listen();
            this.debugPositionModel.add(this.model.position, 'z').min(- 10).max(10).step(.1).name('pos-Z').listen();
            
            // Rotation
            this.debugRotationModel = this.debugModel.addFolder('rotation')
            this.debugRotationModel.add(this.model.rotation, 'x').min(-Math.PI).max(Math.PI).step(.1).name('rot-X').listen();
            this.debugRotationModel.add(this.model.rotation, 'y').min(-Math.PI).max(Math.PI).step(.1).name('rot-Y').listen();
            this.debugRotationModel.add(this.model.rotation, 'z').min(-Math.PI).max(Math.PI).step(.1).name('rot-Z').listen();

            // Scale
            this.debugScaleModel = this.debugModel.addFolder('scale')
            this.debugScaleModel.add(this.model.scale, 'x').min(0).max(2).step(.001).name('sca-X').listen();
            this.debugScaleModel.add(this.model.scale, 'y').min(0).max(2).step(.001).name('sca-Y').listen();
            this.debugScaleModel.add(this.model.scale, 'z').min(0).max(2).step(.001).name('sca-Z').listen();
        }
    }
}