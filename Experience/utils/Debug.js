import * as dat from 'dat.gui'
import Stats from 'stats-js'

export default class Debug {
    constructor() {
        this.active = window.location.hash === '#debug'

        if(this.active)
        {
            // gui
            this.gui = new dat.GUI()

            this.debugFolderLight = this.gui.addFolder('Light')
            this.debugFolderCamera = this.gui.addFolder('Camera')
            this.debugFolderRenderer = this.gui.addFolder('Renderer')
            this.debugFolderModel = this.gui.addFolder('Models')
            this.debugFolderObject = this.gui.addFolder('Objects')
            this.debugFolderHelper = this.gui.addFolder('Helpers')
            this.debugObject = {}

            // stats
            this.stats = new Stats()
            this.stats.showPanel(0)
        }
    }
}