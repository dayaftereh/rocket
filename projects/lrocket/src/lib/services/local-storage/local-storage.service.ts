import { Injectable } from "@angular/core";
import { FallbackStorage } from "./fallback-storage";

@Injectable()
export class LocalStorageService {

    private storage: Storage

    constructor() {
        this.storage = this.create()
    }

    private storageAvailable(): boolean {
        try {
            const storage: Storage = window['localStorage']
            const x: string = '__storage_test__';
            storage.setItem(x, x);
            storage.removeItem(x);
            return true;
        }
        catch (e) {
            return false;
        }
    }

    private keyPrefix(key: string): string {
        return `rocket-${key}`
    }

    getObjectOrDefault<T>(name: string, defaultObject: T): T {
        const item: string | null = this.storage.getItem(this.keyPrefix(name))
        if (item === null || item === undefined) {
            this.updateObject(name, defaultObject)
            return defaultObject
        }

        const obj: T = JSON.parse(item)
        return obj
    }

    updateObject<T>(name: string, obj: T): void {
        const content: string = JSON.stringify(obj)
        this.storage.setItem(this.keyPrefix(name), content)
    }

    private create(): Storage {
        if (this.storageAvailable()) {
            return localStorage
        }

        return this.fallback()
    }

    private fallback(): Storage {
        const fallbackStorage: FallbackStorage = new FallbackStorage()
        return fallbackStorage
    }

}