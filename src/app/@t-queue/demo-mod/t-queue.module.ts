import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TQueueComponent } from './t-queue/t-queue.component';



@NgModule({
  declarations: [
    TQueueComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    TQueueComponent
  ]
})
export class TQueueModule { }
