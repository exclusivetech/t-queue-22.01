import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TQueueComponent } from './t-queue.component';

describe('TQueueComponent', () => {
  let component: TQueueComponent;
  let fixture: ComponentFixture<TQueueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TQueueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
