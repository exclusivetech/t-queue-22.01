import { Component, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { FiFoQueueSym } from '../t-queue.class';


interface DEBUGCOMPONENT {
  id: number,
  name: string
}

/**
 * all for test and debug tqueue
 */

@Component({
  selector: 'ext-t-queue',
  templateUrl: './t-queue.component.html',
  styleUrls: ['./t-queue.component.scss']
})
export class TQueueComponent implements OnInit {



  _queue: FiFoQueueSym<DEBUGCOMPONENT> = new FiFoQueueSym<DEBUGCOMPONENT>(undefined);

  _message: string = '';
  _delMessage: string = '';
  _workingElement: string = '';
  _symMessage: string = 'symulation stopped';
  _intervalID: number = 0;

  constructor() { }

  ngOnInit(): void {

    // this.addElem();

    // listen queue
    this._queue.storeObserver().pipe(


      /* tesr => this.testpipe(tesr),
      map(
      tesr2 => {
        console.log('test2ccom', tesr2);
        return tesr2;
      }) */
    ).subscribe(elem => {
      // console.log('working::', elem);
      /*this._workingElement = 'working: ' + JSON.stringify(
        elem
      ); */
    });

    this._queue.active$().subscribe(elem => {
      console.log('emetto:::::', elem);
    })

  }



  /**
   * @link `return from subscribe <https://stackoverflow.com/questions/39295854/angular-2-how-to-return-data-from-subscribe>`_
   * @param tesr 
   * @returns 
   * cosi funziona come sotto diretto no
   * tesr2 => {
        console.log('test2ccom', tesr2);
        return tesr2;
   */
  testpipe(tesr: Observable<DEBUGCOMPONENT[]>): Observable<DEBUGCOMPONENT[]> {

    return tesr.pipe(map(t => {
      console.log('testccom', t);
      return t;
    })
    );
  }

  addElem(): DEBUGCOMPONENT | undefined {
    const _id = Date.now();
    return this._queue.enqueue({
      id: _id,
      name: 'event-' + _id.toString()
    });
  }

  delElem() {
    this._delMessage = 'removed: ' + JSON.stringify(
      this._queue.dequeue()
    );
  }

  firstElem() {
    this._message = 'first: ' + JSON.stringify(
      this._queue.getFirst()
    );
  }

  lastElem() {
    this._message = 'last: ' + JSON.stringify(
      this._queue.getLast()
    );
  }

  public enqueueSymStart(): void {
    this._symMessage = 'symulation started';
    // this._queue.symulationStart();   // delete from queue
    // on componenent
    this._intervalID = setInterval(function (_this: TQueueComponent) {
      console.log('enqueue:::', _this.addElem());
      // console.log('sym:::', );
    }, 3000, this);
  }

  public symulationStop(): void {
    this._symMessage = 'symulation stopped';
    // this._queue.symulationStop();    // stop sym on queue
    clearInterval(this._intervalID);    // stop on  component
  }

}
