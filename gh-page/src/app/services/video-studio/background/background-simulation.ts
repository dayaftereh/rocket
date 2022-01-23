import { BackgroundParticle } from "./background-particle"

export class BackgroundSimulation {

    private particals: BackgroundParticle[]

    private width: number
    private height: number

    constructor() {
        this.particals = []
    }

    private loadParticals(): void {
        for (let i: number = 0; i < 100; i++) {
            const p: BackgroundParticle = BackgroundParticle.randomEverywhere(this.width, this.height)
            this.particals.push(p)
        }
    }

    async init(): Promise<void> {
        this.loadParticals()
    }

    resize(width: number, height: number) {
        this.width = width
        this.height = height
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
    }

    render(context2d: OffscreenCanvasRenderingContext2D): void {
        this.particals.forEach((p: BackgroundParticle, index: number) => {
            const speed: number = 0.25 + ((p.speed / 11.0) - 0.25)
            context2d.fillStyle = `rgba(255, 255, 255, ${speed})`


            context2d.beginPath()
            context2d.arc(p.x, p.y, p.radius, 0.0, Math.PI * 2.0)
            context2d.fill()

            for (let i = index + 1; i < this.particals.length; i++) {
                const p2: BackgroundParticle = this.particals[i]
                const distance: number = p.distance(p2)
                if (distance > 100) {
                    continue
                }
                const alpha: number = 1.0 - (distance / 100.0)
                context2d.strokeStyle = `rgba(255, 255, 255, ${alpha})`
                context2d.beginPath();
                context2d.moveTo(p.x, p.y)
                context2d.lineTo(p2.x, p2.y)
                context2d.stroke()
            }
        })
    }

}