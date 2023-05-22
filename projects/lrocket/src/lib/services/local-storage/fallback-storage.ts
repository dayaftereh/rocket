export class FallbackStorage implements Storage {

    private obj: any

    constructor() {
        this.obj = {}
    }

    clear(): void {

    }

    getItem(key: string): string | null {
        return this.obj[key]
    }

    setItem(key: string, value: string): void {
        this.obj[key] = value
    }

    key(index: number): string | null {
        const keys: string[] = Object.keys(this.obj)
        if (index >= keys.length || index < 0) {
            return null
        }

        return keys[index]
    }

    get length(): number {
        const keys: string[] = Object.keys(this.obj)
        return keys.length
    }

    removeItem(key: string): void {
        delete this.obj[key]
    }

}