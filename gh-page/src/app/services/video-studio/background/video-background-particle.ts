import { VideoBackgroundOptions } from "./video-background-options"
import { Vector2 } from "three"

export class VideoBackgroundParticle {

    private radius: number

    private v: Vector2
    private position: Vector2

    constructor(private readonly options: VideoBackgroundOptions) {
        this.v = new Vector2()
        this.position = new Vector2()
    }

    private static anyRandom(p: VideoBackgroundParticle): VideoBackgroundParticle {
        const radius: number = p.options.radiusMaximum - p.options.radiusMinimum
        p.radius = p.options.radiusMinimum + Math.random() * radius

        const speedLength: number = p.options.speedMaximum - p.options.speedMinimum
        const speed: number = p.options.speedMinimum + Math.random() * speedLength

        // create a random direction vector
        const v: Vector2 = new Vector2(Math.random(), Math.random())
        p.v = v.normalize().multiplyScalar(speed)

        return p
    }

    static randomEverywhere(options: VideoBackgroundOptions): VideoBackgroundParticle {
        const p: VideoBackgroundParticle = new VideoBackgroundParticle(options)

        const width: number = options.width - options.x
        const height: number = options.height - options.y

        p.position.x = options.x + Math.random() * width
        p.position.y = options.y + Math.random() * height

        this.anyRandom(p)

        return p
    }

    static randomBorder(options: VideoBackgroundOptions): VideoBackgroundParticle {
        const p: VideoBackgroundParticle = new VideoBackgroundParticle(options)

        const side: number = Math.random() * 4.0

        if (side < 1.0) {
            p.position.x = options.x + Math.random() * options.width
            p.position.y = options.y

        } else if (side < 2.0) {
            p.position.x = options.x + options.width
            p.position.y = options.y + Math.random() * options.height
        } else if (side < 3.0) {
            p.position.x = options.x + Math.random() * options.width
            p.position.y = options.y + options.height
        } else {
            p.position.x = options.x
            p.position.y = options.y + Math.random() * options.height
        }

        this.anyRandom(p)

        return p
    }

    get speed(): number {
        return this.v.length()
    }

    get speedPercent(): number {
        const l: number = this.v.length()
        const speedLength: number = this.options.speedMaximum - this.options.speedMinimum
        return (l - this.options.speedMinimum) / speedLength
    }

    render(ctx: any): void {
        const alpha: number = this.speedPercent
        ctx.save()

        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`

        ctx.beginPath()
        ctx.arc(this.position.x, this.position.y, this.radius, 0.0, Math.PI * 2.0)
        ctx.fill()

        ctx.restore()
    }

    renderConnection(ctx: any, other: VideoBackgroundParticle): void {
        const distance: number = this.distance(other)
        const alpha: number = 1.0 - (distance / this.options.distance)

        ctx.save()

        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`

        ctx.beginPath();
        ctx.moveTo(this.position.x, this.position.y)
        ctx.lineTo(other.position.x, other.position.y)
        ctx.stroke()

        ctx.restore()
    }

    isInside(): boolean {
        const x: number = this.options.x
        const y: number = this.options.y
        const width: number = this.options.width
        const height: number = this.options.height

        const outside: boolean = ((this.position.x + this.radius) < x) || ((this.position.y + this.radius) < y) || ((this.position.x - this.radius) > (x + width)) || ((this.position.y - this.radius) > (y + height))
        return !outside
    }

    update(delta: number): void {
        const v: Vector2 = this.v.clone().multiplyScalar(delta)
        this.position = this.position.add(v)
    }

    distance(p: VideoBackgroundParticle): number {
        return p.position.distanceTo(this.position)
    }
}