import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { share } from "rxjs/operators";
import { LocalStorageService } from "../local-storage/local-storage.service";
import { Constants } from "./constants";

@Injectable()
export class ConstantsService {

    private localStorageKey: string = 'constants'

    private subject: BehaviorSubject<Constants>

    constructor(private readonly localStorageService: LocalStorageService) {
        this.subject = new BehaviorSubject<Constants>(this.load())
    }

    private load(): Constants {
        return this.localStorageService.getObjectOrDefault(
            this.localStorageKey,
            this.defaultConstants()
        )
    }

    defaultConstants(): Constants {
        return {
            g: 9.81,
            pAmb: 101325,
            rhoAir: 1.225,
            rhoWater: 997.0,
            gammaAir: 1.4
        }
    }

    get(): Constants {
        const constants: Constants = this.subject.value
        return Object.assign({}, constants)
    }

    asObservable(): Observable<Constants> {
        return this.subject.asObservable().pipe(
            share()
        )
    }

    update(constants: Constants): void {
        this.subject.next(constants)
        this.localStorageService.updateObject(this.localStorageKey, constants)
    }

}