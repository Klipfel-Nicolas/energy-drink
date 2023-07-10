import * as THREE from 'three'
import Experience from '../Experience';

import { HorizontalBlurShader } from 'three/addons/shaders/HorizontalBlurShader.js';
import { VerticalBlurShader } from 'three/addons/shaders/VerticalBlurShader.js';

export default class ShadowFloorCustom {
    constructor() {
        //Experience
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.renderer = this.experience.renderer.renderer;
        this.debug = this.experience.debug;

        this.shadow_params = {
            groupPosition: -2,
            planeSize: {
                width: 30,
                height: 30,
            },
            cameraHeight: 3,
            darkness: 10,
            blur: 1.5,
            shadowOpacity: 1,
            showCameraHelper: false
        }

        // Group
        this.shadowGroup = new THREE.Group()
        this.shadowGroup.position.y = this.shadow_params.groupPosition;
		this.scene.add( this.shadowGroup );

        
        // Plane Geometry
        this.planeGeometry = new THREE.PlaneGeometry( this.shadow_params.planeSize.width, this.shadow_params.planeSize.height ).rotateX( Math.PI / 2 );

        // the render target that will show the shadows in the plane texture
        this.renderTarget = new THREE.WebGLRenderTarget( 512, 512 );
        this.renderTarget.texture.generateMipmaps = false;

        // the render target that we will use to blur the first render target
        this.renderTargetBlur = new THREE.WebGLRenderTarget( 512, 512 );
        this.renderTargetBlur.texture.generateMipmaps = false;

        this.addPlane();
        this.addBlurPlane();
        //this.addFillPlane();
        this.addShadowCamera();
        this.createDepthMaterial();
        this.createBlurMaterial();

        this.addShadowDebug();
        console.log(this.shadowCamera)
    }

    /**
     * Plane with Shadow
     */
    addPlane() {
        // make a plane and make it face up
        this.floorMaterial = new THREE.MeshBasicMaterial( {
            map: this.renderTarget.texture,
            opacity: this.shadow_params.shadowOpacity,
            transparent: true,
            depthWrite: false,
        } );
        
        this.floor = new THREE.Mesh( this.planeGeometry, this.floorMaterial );
        
        // make sure it's rendered after the fillPlane
        this.floor.renderOrder = 1;
        this.shadowGroup.add( this.floor );

        // the y from the texture is flipped!
        this.floor.scale.y = - 1;
    }

    /**
     * Blur Shadow plane
     */
    addBlurPlane() {
        this.blurPlane = new THREE.Mesh( this.planeGeometry);
        this.blurPlane.visible = false;
		this.shadowGroup.add( this.blurPlane );
    }
 

    // Plane Filled (optional) not working good
    addFillPlane() {
        let fillPlane;

        // the plane with the color of the ground
        const fillPlaneMaterial = new THREE.MeshBasicMaterial( {
            color: "0xff00ff",
            opacity: 1,
            transparent: true,
            depthWrite: false,
        } );

        fillPlane = new THREE.Mesh( this.planeGeometry, fillPlaneMaterial );
        fillPlane.rotateX( Math.PI );
        this.shadowGroup.add( fillPlane );
    }

    addShadowCamera() {
        // the camera to render the depth material from
        this.shadowCamera = new THREE.OrthographicCamera( 
            - this.shadow_params.planeSize.width / 2,
            this.shadow_params.planeSize.width/ 2, 
            this.shadow_params.planeSize.height / 2,
            - this.shadow_params.planeSize.height / 2,
            0,
            this.shadow_params.cameraHeight
        );
        this.shadowCamera.rotation.x = Math.PI / 2; // get the camera to look up
        this.shadowGroup.add( this.shadowCamera );

        this.cameraHelper = new THREE.CameraHelper( this.shadowCamera );
    }

    /**
     * Create Shadow Material
     */
    createDepthMaterial() {
        this.depthMaterial = new THREE.MeshDepthMaterial();
        this.depthMaterial.userData.darkness = { value: this.shadow_params.darkness };
        
        this.depthMaterial.onBeforeCompile = (shader) => {
            
            shader.uniforms.darkness = this.depthMaterial.userData.darkness;
            shader.fragmentShader = /* glsl */`
                uniform float darkness;
                ${shader.fragmentShader.replace(
                    'gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );',
                    'gl_FragColor = vec4( vec3( 0.0 ), ( 1.0 - fragCoordZ ) * darkness );'
                )}
            `;

        }

        this.depthMaterial.depthTest = false;
        this.depthMaterial.depthWrite = false;
    }

    /**
     * Create Blur Material
     */
    createBlurMaterial() {
        this.horizontalBlurMaterial = new THREE.ShaderMaterial( HorizontalBlurShader );
        this.horizontalBlurMaterial.depthTest = false;

        this.verticalBlurMaterial = new THREE.ShaderMaterial( VerticalBlurShader );
        this.verticalBlurMaterial.depthTest = false;
    }

    blurShadow( amount ) {

        this.blurPlane.visible = true;

        // blur horizontally and draw in the renderTargetBlur
        this.blurPlane.material = this.horizontalBlurMaterial;
        this.blurPlane.material.uniforms.tDiffuse.value = this.renderTarget.texture;
        this.horizontalBlurMaterial.uniforms.h.value = amount * 1 / 256;

        this.renderer.setRenderTarget( this.renderTargetBlur );
        this.renderer.render( this.blurPlane, this.shadowCamera );

        // blur vertically and draw in the main renderTarget
        this.blurPlane.material = this.verticalBlurMaterial;
        this.blurPlane.material.uniforms.tDiffuse.value = this.renderTargetBlur.texture;
        this.verticalBlurMaterial.uniforms.v.value = amount * 1 / 256;

        this.renderer.setRenderTarget( this.renderTarget );
        this.renderer.render( this.blurPlane, this.shadowCamera );

        this.blurPlane.visible = false;

    }

    /**
     * Debug
     */
    addShadowDebug() {
        if(this.debug.active) {
            this.debugShadow = this.debug.debugFolderObject.addFolder('shadowFloor');

            this.debugShadow.add( this.shadow_params, 'blur').min(0).max(10).step(.1).name('blur').listen();

            this.debugShadow.add(this.shadow_params, 'darkness').min(0).max(10).step(.1).name('darkness').listen().onChange(() => {
                this.depthMaterial.userData.darkness.value = this.shadow_params.darkness;
            });

            this.debugShadow.add( this.shadow_params, 'shadowOpacity').min(0).max(1).step(.01).name('shadowOpacity').listen().onChange(() => {
                this.floor.material.opacity = this.shadow_params.shadowOpacity;
            } );

            this.debugShadow.add( this.shadow_params, 'groupPosition').min(-10).max(10).step(.1).name('floor Y').listen().onChange(() => {
                this.shadowGroup.position.y = this.shadow_params.groupPosition;
            } );

            this.debugShadow.add( this.shadow_params, 'cameraHeight').min(0).max(10).step(.1).name('camera height').listen().onChange(() => {
                this.shadowCamera.far = this.shadow_params.cameraHeight;
                console.log(this.shadowCamera)
                this.shadowCamera.updateProjectionMatrix ()
            } );

            this.debugShadow.add( this.shadow_params, 'showCameraHelper', true ).onChange( () => {
                if ( this.shadow_params.showCameraHelper ) {
                    this.scene.add( this.cameraHelper );
                } else {
                    this.scene.remove( this.cameraHelper );
                }
            } );
        }
    }


    // UPDATE
    update() {

        // remove the background
        const initialBackground = this.scene.background;
        this.scene.background = null;

        // force the depthMaterial to everything
	    this.cameraHelper.visible = false;
        this.scene.overrideMaterial = this.depthMaterial;

        const initialClearAlpha = this.renderer.getClearAlpha();
        this.renderer.setClearAlpha( 0 );

        // render to the render target to get the depths
        this.renderer.setRenderTarget( this.renderTarget );
        this.renderer.render( this.scene, this.shadowCamera );

        // and reset the override material
		this.scene.overrideMaterial = null;
        this.cameraHelper.visible = true;

        this.blurShadow(this.shadow_params.blur)
        this.blurShadow( this.shadow_params.blur * 0.4 );

        // reset and render the normal scene
        this.renderer.setRenderTarget( null );
        this.renderer.setClearAlpha( initialClearAlpha );
        this.scene.background = initialBackground;

    }
}