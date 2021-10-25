import { AxesHelper, PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export class Viewer3D {

    private scene: Scene | undefined
    private camera: PerspectiveCamera | undefined
    private renderer: WebGLRenderer | undefined

    private orbitControls: OrbitControls | undefined

    constructor() {

    }

    private get width(): number {
        return window.innerWidth * 0.75
    }

    private get height(): number {
        return window.innerHeight * 0.5
    }

    async init(): Promise<void> {
        this.scene = new Scene()

        this.camera = new PerspectiveCamera(75, this.width / this.height, 0.1, 1000.0)

        const container: HTMLCanvasElement = document.querySelector("#container-3d")
        this.renderer = new WebGLRenderer()
        this.renderer.setSize(this.width, this.height)
        container.appendChild(this.renderer.domElement)

        this.orbitControls = new OrbitControls(this.camera, container)

        await this.loadObjects()

        // delay the update loop
        setTimeout(() => {
            this.loop()
        }, 5000)
    }

    private async loadObjects(): Promise<void> {
        // create the origin
        const origin: AxesHelper = new AxesHelper(100.0)
        this.scene.add(origin)       
    }

    private loop(): void {
        requestAnimationFrame(() => {
            this.loop()
        })

        this.update()

        // redraw
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera)
        }
    }

    private update(): void {
        if(this.orbitControls){
            this.orbitControls.update()
        }
    }

}