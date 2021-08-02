import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { share } from "rxjs/operators";
import { Globals } from "./globals";

@Injectable()
export class GlobalsService {

    private subject: BehaviorSubject<Globals>

    constructor() {
        this.subject = new BehaviorSubject<Globals>(this.load())
    }

    private load(): Globals {
        return {
            g: 9.81,
            pAmb: 101325,
            rhoAir: 1.225
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
    }

}