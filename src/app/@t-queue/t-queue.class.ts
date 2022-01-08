/**
 * @link `followed <https://www.javascripttutorial.net/javascript-queue/>`_
 * @link `array functions <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array?retiredLocale=it>`_
 */

import { concatMap, Observable, of } from "rxjs";
import { QSTATUS } from "./init-const";
import { TStore } from "./t-store.class";


/**
 * queue base class
 * @link `observable array <https://stackoverflow.com/questions/50856647/angular-6-rxjs-6-0-how-to-push-new-element-to-array-contained-by-observable>`_
 */
abstract class TQueue<T> extends TStore<T[]> {

    // mantain queue status
    private _qstatus: TStore<QSTATUS> = new TStore<QSTATUS>('ONINIT');
    // active element to be processed
    private _active: TStore<T> = new TStore<T>();

    // private _queue: T[] = [];       // original ### now all on store -> extends TStore<T[]>
    private _maxelements: number = 0;   // if 0 infinite list or max possible items
    private _lenght: number = 0;   // how many items in queue

    qstatusGet(): QSTATUS {
        return this._qstatus.storeGet();
    }

    qstatusSet(status: QSTATUS) {
        this._qstatus.storeSet(status);
    }

    active$(): Observable<T> {
        return this._active.storeObserver();
    }

    constructor(
        length: number | undefined
    ) {
        super([]);
        if (length) {
            this._lenght = length;
        }

        this.storeObserver().pipe(

            // map return observable array
            // conatMap return observable for every element
            concatMap(t => {
                // console.log('pipe debug:::', this._qstatus.storeGet(), t);
                let returnElement: T | undefined;
                switch (this._qstatus.storeGet()) {
                    case 'ONINIT': returnElement = undefined;
                        break;
                    case 'AWAIT': returnElement = undefined;
                        break;
                    case 'RUNNING': returnElement = this.dequeue();
                        break;
                }
                // from T[] -> get always first
                // return of(t[0]);
                return of(returnElement);
            }),
        ).subscribe(qelem => {
            if (qelem) {
                // console.log('accodo:::', this._qstatus.storeGet(), qelem);
                this._active.storeSet(qelem);
                this.storeFlush();
            } else {
                // console.log('niente:::', this._qstatus.storeGet(), qelem);
            }

        });


        /**
         * at moment not check fore only flush on change
         */
        this._qstatus.storeObserver()
            /* .pipe() */
            .subscribe(() => this.storeFlush());
    }

    /**
     * 
     * define from derived
     */
    abstract enqueue(qelem: T): void;
    abstract dequeue(): T | undefined;      // remove element
    // abstract queue(): T[];      // return ordered queue
    // abstract queueAsync(): T | undefined;      // return observable ordered queue

    /**
     * check only if we can add other element
     */
    private canAddElm(): boolean {
        if (this._maxelements) {
            // if no zero check how many
            if (this._lenght < this._maxelements) {
                return true;
            } else {
                return false;
            }
        } else {
            // if zero === 0 always add
            return true
        }
    }

    protected setMaxelements(maxelements: number) {
        this._maxelements = maxelements;
    }

    protected lenght(): number {
        return this._lenght;
    }

    /**
     * add and, eventually, remove last
     * @param qelem 
     */
    protected addFirst(qelem: T) {
        const _queue = this.storeGet();
        if (this.canAddElm()) {
            this._lenght++;
        } else {
            // remove last -> lenght the same
            _queue.pop();
        }
        _queue.unshift(qelem);
        this.storeSet(_queue);
    }

    /**
     * add and, eventually, remove first
     * @param qelem 
     */
    protected addLast(qelem: T) {
        const _queue = this.storeGet();
        if (this.canAddElm()) {
            this._lenght++;
        } else {
            // remove first -> lenght the same
            _queue.shift();
        }
        _queue.push(qelem);
        this.storeSet(_queue);
    }

    /*
     * non usare
    protected addLast$(qelem: T) {

        console.log('addLast$', qelem, this);

        this.queue$.pipe(take(1)).subscribe(val => {
            console.log(val)
            const newArr = [...val, qelem];
            this._queue$.next(newArr);
        })
    }*/

    protected remFirst(): T | undefined {
        const _queue = this.storeGet();
        if (this._lenght) {
            this._lenght--;
            const rem = <T>_queue.shift();
            this.storeSet(_queue);
            return rem;
        } else {
            return undefined;
        }
    }

    protected remLast(): T | undefined {
        const _queue = this.storeGet();
        if (this._lenght) {
            this._lenght--;
            const rem = <T>_queue.pop();
            this.storeSet(_queue);
            return rem;
        } else {
            return undefined;
        }
    }

    public getFirst(): T | undefined {
        if (this._lenght) {
            return <T>this.storeGet()[0];
        } else {
            return undefined;
        }
    }

    public getLast(): T | undefined {
        if (this._lenght) {
            return <T>this.storeGet()[this._lenght - 1];
        } else {
            return undefined;
        }
    }

    public queue(): T[] {
        return <T[]>this.storeGet();
    }

    public queue$(): Observable<T[]> {
        return this.storeObserver() // of(<T[]>this._queue);
    }

}

/**
 * classic First In First Out
 * like event sequence
 */
export class FiFoQueue<T> extends TQueue<T> implements TQueue<T> {

    constructor(
        length: number | undefined
    ) {
        super(length);
    }

    enqueue(qelem: T): T | undefined {
        this.addLast(qelem);
        return qelem;
    }

    dequeue(): T | undefined {
        return this.remFirst();
    }

}


export class FiFoQueueSym<T> extends FiFoQueue<T> implements FiFoQueue<T> {

    /**
     * when started every _gap second remove a element from queue
     * @link `setInterval <https://stackoverflow.com/questions/1224463/is-there-any-way-to-call-a-function-periodically-in-javascript>`_
     * @link `documentation <https://developer.mozilla.org/en-US/docs/Web/API/setInterval>`_
     * 
     */
    _intervalID: number = 0;

    public dequeueSymStart(seconds: number): void {

        this._intervalID = setInterval(function (_this: TQueue<T>) {
            console.log('dequeue:::', _this.dequeue());
        }, seconds * 1000, this);
    }

    public symulationStop(): void {
        clearInterval(this._intervalID);
    }

}



/**
 * classic Last In First Out / Stack
 */
export class LiFoQueue<T> extends TQueue<T> implements TQueue<T> {

    constructor(
        length?: number | undefined
    ) {
        super(length);
    }

    enqueue(qelem: T): void {
        this.addFirst(qelem);
    }

    dequeue(): T | undefined {
        return this.remFirst();
    }

}


