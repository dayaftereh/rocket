import { VideoBackgroundParticle } from "./video-background-particle"
import { VideoBackgroundSimulationOptions } from "./video-background-simulation-options"

export class VideoBackgroundSimulation {

    private particles: VideoBackgroundParticle[]


    constructor(private readonly options: VideoBackgroundSimulationOptions) {
        this.particles = []
    }

    private loadParticals(): void {
        for (let i: number = 0; i < this.options.particles; i++) {
            const p: VideoBackgroundParticle = VideoBackgroundParticle.randomEverywhere(this.options)
            this.particles.push(p)
        }
    }

    async init(): Promise<void> {
        this.loadParticals()
    }

    update(delta: number): void {

        // remove all particles outside
        this.particles = this.particles.filter((p: VideoBackgroundParticle) => {
            return p.isInside()
        })

        this.particles.forEach((p: VideoBackgroundParticle) => {
            p.update(delta)
        })

        // create new particles if neede
        while (this.particles.length < this.options.particles) {
            const p: VideoBackgroundParticle = VideoBackgroundParticle.randomBorder(this.options)
            this.particles.push(p)
        }
    }

    //@ts-ignore
    render(context2d: OffscreenCanvasRenderingContext2D): void {
        this.particles.forEach((p: VideoBackgroundParticle, index: number) => {
            // draw the partical
            p.render(context2d)

            for (let i = index + 1; i < this.particles.length; i++) {
                const p2: VideoBackgroundParticle = this.particles[i]
                const distance: number = p.distance(p2)
                if (distance > this.options.distance) {
                    continue
                }
                // draw the connection
                p.renderConnection(context2d, p2)
            }
        })
    }

}