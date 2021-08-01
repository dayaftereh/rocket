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
            p_amb: 101325
        }
    }

    get(): Globals {
        return this.subject.value
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