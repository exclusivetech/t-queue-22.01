import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { FirstComponent } from './first/first.component';
import { SecondComponent } from './second/second.component';
import { TQueueModule } from '../@t-queue/demo-mod/t-queue.module';
// this is for compiler
export { HomeComponent } from './home/home.component';
export { FirstComponent } from './first/first.component';
export { SecondComponent } from './second/second.component';

@NgModule({
  declarations: [
    HomeComponent,
    FirstComponent,
    SecondComponent
  ],
  imports: [
    CommonModule,
    TQueueModule
  ],
  // this for angular compiler
  exports: [
    HomeComponent,
    FirstComponent,
    SecondComponent
  ] 
})
export class PagesModule { }
