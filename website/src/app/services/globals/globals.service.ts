import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { share } from "rxjs/operators";
import { LocalStorageService } from "../local-storage/local-storage.service";
import { Globals } from "./globals";

@Injectable()
export class GlobalsService {

    private localStorageKey: string = 'globals'

    private subject: BehaviorSubject<Globals>

    constructor(private readonly localStorageService: LocalStorageService) {
        this.subject = new BehaviorSubject<Globals>(this.load())
    }

    private load(): Globals {
        return this.localStorageService.getObjectOrDefault(
            this.localStorageKey,
            this.defaultGlobals()
        )
    }

    defaultGlobals(): Globals {
        return {
            g: 9.81,
            pAmb: 101325,
            rhoAir: 1.225,
            rhoWater: 997.0
        }
    }

    get(): Globals {
        const globals: Globals = this.subject.value
        return Object.assign({}, globals)
    }

    asObservable(): Observable<Globals> {
        return this.subject.asObservable().pipe(
            share()
        )
    }

    update(globals: Globals): void {
        this.subject.next(globals)
        this.localStorageService.updateObject(this.localStorageKey, globals)
    }

}