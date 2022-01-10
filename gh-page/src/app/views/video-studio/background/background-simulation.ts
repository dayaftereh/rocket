import { BackgroundParticle } from "./background-particle"

export class BackgroundSimulation {

    private lastTime: number

    private context2d: CanvasRenderingContext2D

    private particals: BackgroundParticle[]

    constructor(private readonly canvas: HTMLCanvasElement) {
        this.lastTime = 0.0
        this.particals = []
    }

    private loadParticals(): void {
        for (let i: number = 0; i < 100; i++) {
            const p: BackgroundParticle = BackgroundParticle.randomEverywhere(this.width, this.height)
            this.particals.push(p)
        }
    }

    async init(): Promise<void> {
        this.context2d = this.canvas.getContext('2d')
        if (!this.context2d) {
            throw new Error('unable to get 2d render context')
        }

        this.loadParticals()
    }

    private get width(): number {
        return this.canvas.width
    }

    private get height(): number {
        return this.canvas.height
    }

    animate(): void {

        requestAnimationFrame((time: number) => {
            // update delta
            const delta: number = (time - this.lastTime) / 1000.0
            this.lastTime = time
            // call updated
            this.update(delta)
            this.animate()
        })
    }

    update(delta: number): void {

        this.particals = this.particals.filter((p: BackgroundParticle) => {
            return p.isInside(0.0, 0.0, this.width, this.height)
        })
        
        this.particals.forEach((p: BackgroundParticle) => {
            p.update(delta)
        })

        while (this.particals.length < 100) {
            const p: BackgroundParticle = BackgroundParticle.randomBorder(0, 0, this.width, this.height)
            this.particals.push(p)
        }

        this.render()
    }

    render(): void {
        this.context2d.clearRect(0.0, 0.0, this.width, this.height)

        this.particals.forEach((p: BackgroundParticle, index: number) => {
            const speed: number = 0.25 + ((p.speed / 11.0) - 0.25)
            this.context2d.fillStyle = `rgba(255, 255, 255, ${speed})`


            this.context2d.beginPath()
            this.context2d.arc(p.x, p.y, p.radius, 0.0, Math.PI * 2.0)
            this.context2d.fill()

            for (let i = index + 1; i < this.particals.length; i++) {
                const p2: BackgroundParticle = this.particals[i]
                const distance: number = p.distance(p2)
                if (distance > 100) {
                    continue
                }
                const alpha: number = 1.0 - (distance / 100.0)
                this.context2d.strokeStyle = `rgba(255, 255, 255, ${alpha})`
                this.context2d.beginPath();
                this.context2d.moveTo(p.x, p.y)
                this.context2d.lineTo(p2.x, p2.y)
                this.context2d.stroke()
            }
        })
    }

    destroy(): void {

    }

}