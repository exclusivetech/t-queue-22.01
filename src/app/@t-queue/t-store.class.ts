/**
 * base class  to states implementation
 */

import { BehaviorSubject, map, Observable } from "rxjs";



/**
 * BehaviorSubject now always array []
 * so can initialize without value only with empty array []
 * but transparent to app
 */
export class TStore<T> {

    private _store$Subject: BehaviorSubject<T[]> = new BehaviorSubject<T[]>([]);
    // now init with map private store$Observer: Observable<T>;
    private store$Observer: Observable<T> = this._store$Subject.asObservable()
        .pipe(
            map(sElem => sElem[0]
            ));

    // we can even initialize
    constructor(initialState?: T) {
        if (initialState) {
            this.storeSet(initialState);
        }
        // this._store$Subject = new BehaviorSubject(initialState);
        // this.store$Observer = this._store$Subject.asObservable();
    }


    storeGet($callback?: (store: T) => void): T {
        const tReturn = this._store$Subject.getValue()[0];
        if ($callback) {
            $callback(tReturn);
        }
        return tReturn;
    }

    storeSet(nextStore: T, $callback?: (store: T) => void): T {
        const nStore: T[] = [];
        nStore.push(nextStore);
        this._store$Subject.next(nStore);
        if ($callback) {
            $callback(nextStore);
        }
        return nextStore;
    }

    /**
     * per eventuali gestioni future
     * @returns 
     */
    storeObserver($callback?: (store: Observable<T>) => void): Observable<T> {
        if ($callback) {
            $callback(this.store$Observer);
        }
        return this.store$Observer;
    }

    storeFlush() {
        this.storeSet(
            this.storeGet()
        );
    }

}


