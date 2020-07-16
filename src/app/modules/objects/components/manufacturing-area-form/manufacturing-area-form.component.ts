import { forwardRef, Component, OnInit, OnDestroy } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormBuilder, Validators } from '@angular/forms';
import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-manufacturing-area-form',
  template: `
  <form [formGroup]="form">
    <mat-form-field appearance="fill">
      <mat-label>Name</mat-label>
      <input
        formControlName="name"
        matInput
        placeholder="Area Name"
      />
      <mat-hint>A catchy name</mat-hint>
    </mat-form-field>
  </form>
  `,
  styleUrls: ['./manufacturing-area-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ManufacturingAreaFormComponent),
      multi: true,
    },
  ],
})
export class ManufacturingAreaFormComponent implements OnInit, OnDestroy, ControlValueAccessor {
  form = this.fb.group({
    name: ['', Validators.required],
  });

  sub: Subscription;

  destroyed$ = new Subject();

  writeValue(obj: any) {
    this.form.patchValue(obj);
  }
  onChange = (val: any) => {};

  registerOnChange(fn) {
    this.onChange = fn;
    this.sub?.unsubscribe();
    this.sub = this.form.valueChanges.pipe(
      takeUntil(this.destroyed$),
    ).subscribe(value => this.onChange(value));
  }

  onTouch = () => {};

  registerOnTouched(fn) {
    this.onTouch = fn;
  }

  constructor(public fb: FormBuilder) { }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

}
