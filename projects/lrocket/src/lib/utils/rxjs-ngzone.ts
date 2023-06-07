import { NgZone } from "@angular/core";
import { Observable, Observer, OperatorFunction } from "rxjs";

export function runInZone<T>(zone: NgZone): OperatorFunction<T, T> {
    // check if zone is given
    if (!zone) {
        return (source: Observable<T>) => {
            return source
        }
    }

    // create the zone wrapper
    return (source: Observable<T>) => {
        return new Observable<T>(observer => {

            const inZoneObserver: Observer<T> = {
                next: (value: T) => {
                    zone.run(() => {
                        observer.next(value)
                    })
                },
                error: (e: any) => {
                    zone.run(() => {
                        observer.error(e)
                    })
                },
                complete: () => {
                    zone.run(() => {
                        observer.complete()
                    })
                },
            }

            return source.subscribe(inZoneObserver);
        });
    };
}