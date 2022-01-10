export class BackgroundParticle {

    x: number
    y: number

    vx: number
    vy: number

    radius: number

    constructor() {

    }

    private static anyRandom(p: BackgroundParticle): BackgroundParticle {
        p.radius = 1 + Math.random() * 5

        p.vx = Math.random()
        p.vy = Math.random()

        p.vx *= 3.0 + Math.random() * 8
        p.vy *= 3.0 + Math.random() * 8

        return p
    }

    static randomEverywhere(width: number, height: number): BackgroundParticle {
        const p: BackgroundParticle = new BackgroundParticle()

        p.x = Math.random() * width
        p.y = Math.random() * height

        this.anyRandom(p)

        return p
    }

    static randomBorder(x: number, y: number, width: number, height: number): BackgroundParticle {
        const p: BackgroundParticle = new BackgroundParticle()

        const side: number = Math.random() * 4.0

        if (side < 1.0) {
            p.x = x + Math.random() * width
            p.y = y

        } else if (side < 2.0) {
            p.x = x + width
            p.y = y + Math.random() * height
        } else if (side < 3.0) {
            p.x = x + Math.random() * width
            p.y = y + height
        } else {
            p.x = x
            p.y = y + Math.random() * height
        }

        this.anyRandom(p)

        return p
    }

    get speed(): number {
        return Math.sqrt(this.vx * this.vx + this.vy * this.vy)
    }

    isInside(x: number, y: number, width: number, height: number): boolean {
        const outside: boolean = ((this.x + this.radius) < x) || ((this.y + this.radius) < y) || ((this.x - this.radius) > (x + width)) || ((this.y - this.radius) > (y + height))
        return !outside
    }

    update(delta: number): void {
        this.x += (this.vx * delta)
        this.y += (this.vy * delta)
    }

    distance(p: BackgroundParticle): number {
        const dx: number = this.x - p.x
        const dy: number = this.y - p.y
        return Math.sqrt(dx * dx + dy * dy)
    }
}