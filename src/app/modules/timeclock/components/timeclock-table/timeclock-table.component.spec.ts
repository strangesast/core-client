import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TimeclockTableComponent } from './timeclock-table.component';

describe('TimeclockTableComponent', () => {
  let component: TimeclockTableComponent;
  let fixture: ComponentFixture<TimeclockTableComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [TimeclockTableComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeclockTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
