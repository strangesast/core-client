import { Component, OnInit, forwardRef, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  Validators,
} from '@angular/forms';
import { Subject, Subscription, of } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { ObjectsService } from '../../services/objects.service';

@Component({
  selector: 'app-manufacturing-order-form',
  template: `
    <form [formGroup]="form">
      <mat-form-field appearance="fill" class="component">
        <mat-label>Component</mat-label>
        <mat-select formControlName="component">
          <mat-option
            *ngFor="let component of components$ | async"
            [value]="component.id"
            >{{ component.name }}</mat-option
          >
        </mat-select>
      </mat-form-field>
      <mat-form-field appearance="fill" class="customer">
        <mat-label>Customer</mat-label>
        <mat-select formControlName="customer">
          <mat-option
            *ngFor="let customer of customers$ | async"
            [value]="customer.id"
            >{{ customer.name }}</mat-option
          >
        </mat-select>
      </mat-form-field>
      <mat-form-field appearance="fill">
        <mat-label>Qty</mat-label>
        <input type="number" min="0" formControlName="qty" matInput placeholder="1000" />
        <mat-hint>Top level qty</mat-hint>
      </mat-form-field>
      <mat-form-field appearance="fill">
        <mat-label>Ship Date</mat-label>
        <input matInput formControlName="shipDate" [matDatepicker]="picker">
        <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
        <mat-datepicker #picker></mat-datepicker>
      </mat-form-field>
    </form>
  `,
  styleUrls: ['./manufacturing-order-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ManufacturingOrderFormComponent),
      multi: true,
    },
  ],
})
export class ManufacturingOrderFormComponent
  implements OnInit, ControlValueAccessor, OnDestroy {
  form = this.fb.group({
    component: [{ name: 'Component A', version: 1, id: 'component_a' }],
    customer: [null, Validators.required],
    qty: [0, Validators.min(1)],
    shipDate: [null, Validators.required],
    stages: this.fb.array([
      this.fb.group({
        id: ['step_1'],
        started_at: [new Date()],
        available_at: [new Date()],
        completed_at: [null],
        segments: this.fb.array([
          this.fb.group({
            employee_id: [''],
            date_start: [new Date()],
            date_stop: [new Date()],
            amount: [10],
          }),
        ]),
      }),
    ]),
  });

  sub: Subscription;
  destroyed$ = new Subject();
  components$ = this.service.components$;
  customers$ = this.service.customers$;

  writeValue(obj: any) {
    this.form.patchValue(obj);
  }
  onChange = (val: any) => {};

  registerOnChange(fn) {
    this.onChange = fn;
    this.sub?.unsubscribe();
    this.sub = this.form.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe((value) => this.onChange(value));
  }

  onTouch = () => {};

  registerOnTouched(fn) {
    this.onTouch = fn;
  }

  constructor(public fb: FormBuilder, public service: ObjectsService) {}

  ngOnInit(): void {}

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
