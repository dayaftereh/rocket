import { AxesHelper, CylinderGeometry, Group, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { API } from "../api/api";
import { Message } from "../api/message";

export class Viewer3D {

    private scene: Scene | undefined
    private camera: PerspectiveCamera | undefined
    private renderer: WebGLRenderer | undefined

    private orbitControls: OrbitControls | undefined

    private rocket: Group | undefined

    constructor(private readonly api: API) {

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

        // get the message updates
        this.api.asObservable().subscribe((message: Message) => {
            this.onMessage(message)
        })

        // delay the update loop
        setTimeout(() => {
            this.loop()
        }, 5000)
    }

    private async loadObjects(): Promise<void> {
        // create the origin
        const origin: AxesHelper = new AxesHelper(100.0)
        this.scene.add(origin)

        this.rocket = new Group()

        const airFrameGeometry: CylinderGeometry = new CylinderGeometry(7.5, 7.5, 50, 60);
        const airFrameMaterial: MeshBasicMaterial = new MeshBasicMaterial({ color: 0xffff00 });
        const airFrame: Mesh = new Mesh(airFrameGeometry, airFrameMaterial);

        const noseGeometry: CylinderGeometry = new CylinderGeometry(0.0, 7.5, 6, 60);
        const noseMaterial: MeshBasicMaterial = new MeshBasicMaterial({ color: 0xffff00 });
        const nose: Mesh = new Mesh(noseGeometry, noseMaterial);
        nose.position.x = 50

        this.rocket.add(airFrame, nose)

        this.scene.add(this.rocket)
    }

    private onMessage(message: Message): void {
        this.rocket.rotation.x = message.rotationX * Math.PI / 180.0
        this.rocket.rotation.y = message.rotationY * Math.PI / 180.0
        this.rocket.rotation.z = message.rotationZ * Math.PI / 180.0
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
        if (this.orbitControls) {
            this.orbitControls.update()
        }
    }

}