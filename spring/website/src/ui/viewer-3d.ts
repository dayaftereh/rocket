import { fromEvent } from "rxjs";
import { ArrowHelper, AxesHelper, CylinderGeometry, GridHelper, Group, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, Vector3, WebGLRenderer } from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { API } from "../api/api";
import { Message } from "../api/message";

export class Viewer3D {

    private scene: Scene | undefined
    private camera: PerspectiveCamera | undefined
    private renderer: WebGLRenderer | undefined

    private orbitControls: OrbitControls | undefined

    private rocket: Group | undefined

    private acceleration: ArrowHelper | undefined

    constructor(private readonly api: API) {

    }

    private get container(): HTMLElement {
        const container: HTMLElement = document.querySelector("#container-3d")
        return container
    }

    private get width(): number {
        const container: HTMLElement = this.container
        const style: CSSStyleDeclaration = window.getComputedStyle(container);
        const width: number = container.offsetWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight) - parseFloat(style.borderLeft) - parseFloat(style.borderRight) - parseFloat(style.marginLeft) - parseFloat(style.marginRight);
        console.log(width)
        return width
    }

    private get height(): number {
        return window.innerHeight * 0.75
    }

    async init(): Promise<void> {
        this.scene = new Scene()

        this.camera = new PerspectiveCamera(75, this.width / this.height, 0.1, 1000.0)
        this.camera.up.set(0.0, 0.0, 1.0)
        this.camera.position.set(100.0, 100.0, 100.0)

        this.renderer = new WebGLRenderer()
        this.renderer.setSize(this.width, this.height)

        const container: HTMLElement = this.container
        container.appendChild(this.renderer.domElement)

        this.orbitControls = new OrbitControls(this.camera, container)

        await this.loadObjects()

        // get the message updates
        this.api.asObservable().subscribe((message: Message) => {
            this.onMessage(message)
        })

        fromEvent(window, 'resize').subscribe(() => {
            this.onResize()
        })

        // check if the container now visitable
        const observer: IntersectionObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.intersectionRatio > 0) {
                    this.onResize()
                }
            });
        }, {
            root: document.documentElement,
        });
        observer.observe(container)

        // delay the update loop
        setTimeout(() => {
            this.loop()
        }, 500)
    }

    private onResize(): void {
        console.log(this.width, this.height)
        if (this.camera) {
            this.camera.aspect = this.width / this.height;
            this.camera.updateProjectionMatrix();
        }

        if (this.renderer) {
            this.renderer.setSize(this.width, this.height);
        }
    }

    private async loadObjects(): Promise<void> {
        // create the origin
        const origin: AxesHelper = new AxesHelper(100.0)
        this.scene.add(origin)

        const grid: GridHelper = new GridHelper(100.0, 10.0)
        grid.rotation.x = Math.PI / 2
        grid.position.z = -1.0
        this.scene.add(grid)

        // Acceleration        
        this.acceleration = new ArrowHelper(
            new Vector3(0.0, 0.0, 1.0),
            new Vector3(0.0, 0.0, 0.0),
            1.0,
            '#ffff00'
        )
        this.scene.add(this.acceleration)

        // Rocket
        this.rocket = new Group()

        const airFrameGeometry: CylinderGeometry = new CylinderGeometry(7.5, 7.5, 50, 60);
        const airFrameMaterial: MeshBasicMaterial = new MeshBasicMaterial({
            color: 0xd3d3d3,
            opacity: 0.5,
            transparent: true
        });
        const airFrame: Mesh = new Mesh(airFrameGeometry, airFrameMaterial);
        airFrame.position.y = 25.0

        const noseGeometry: CylinderGeometry = new CylinderGeometry(0.0, 7.5, 6, 60);
        const noseMaterial: MeshBasicMaterial = new MeshBasicMaterial({
            color: 0xd3d3d3,
            opacity: 0.5,
            transparent: true
        });
        const nose: Mesh = new Mesh(noseGeometry, noseMaterial);
        nose.position.y = 53

        const container: Group = new Group()
        container.rotation.x = Math.PI / 2
        container.add(airFrame, nose)

        const coordRocket: AxesHelper = new AxesHelper(25.0)
        this.rocket.add(container, coordRocket)

        this.scene.add(this.rocket)
    }

    private onMessage(message: Message): void {
        if (this.rocket) {
            this.rocket.rotation.x = message.rotationX * Math.PI / 180.0
            this.rocket.rotation.y = message.rotationY * Math.PI / 180.0
            this.rocket.rotation.z = message.rotationZ * Math.PI / 180.0
        }

        if (this.acceleration) {
            const direction: Vector3 = new Vector3(
                message.accelerationX,
                message.accelerationY,
                message.accelerationZ,
            )
            const norm: Vector3 = direction.normalize()

            const length: number = direction.length()
            this.acceleration.setLength(length * 10.0)
            this.acceleration.setDirection(norm)
        }

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