import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdScheduleGraphComponent } from './prod-schedule-graph.component';

describe('ProdScheduleGraphComponent', () => {
  let component: ProdScheduleGraphComponent;
  let fixture: ComponentFixture<ProdScheduleGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProdScheduleGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdScheduleGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
