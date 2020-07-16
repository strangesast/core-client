import { Component, OnInit, forwardRef, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  ControlValueAccessor,
  Validators,
  FormControl,
  FormGroup,
  FormArray,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { of, Subject, Subscription } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-component-form',
  template: `
    <form [formGroup]="form">
      <mat-form-field appearance="fill">
        <mat-label>Name</mat-label>
        <input formControlName="name" matInput placeholder="Product Name" />
        <mat-hint>A catchy name</mat-hint>
      </mat-form-field>
      <mat-form-field appearance="fill">
        <mat-label>Description</mat-label>
        <textarea formControlName="description" matInput></textarea>
      </mat-form-field>
      <mat-form-field appearance="fill">
        <mat-label>Subcomponents</mat-label>
        <mat-select formControlName="subcomponents" multiple>
          <mat-select-trigger>
            {{ subcomponents.value ? subcomponents.value.length : 0 }}
            Components
          </mat-select-trigger>
          <mat-option
            *ngFor="let component of subcomponents$ | async"
            [value]="component.id"
            >{{ component.name }}</mat-option
          >
        </mat-select>
      </mat-form-field>
      <div class="sub-header">
        <span>Operations</span>
      </div>
      <div formArrayName="operations" class="form-list" *ngIf="editOperations">
        <div
          *ngFor="let control of operations.controls; index as j"
          [formGroupName]="j"
          class="form-list-item"
        >
          <span>{{ j + 1 }}</span>
          <mat-form-field appearance="fill">
            <mat-label>Name</mat-label>
            <input
              formControlName="name"
              matInput
              placeholder="Operation Name"
            />
          </mat-form-field>
          <mat-form-field appearance="fill">
            <mat-label>Area</mat-label>
            <mat-select formControlName="area">
              <mat-option
                *ngFor="let area of areas$ | async"
                [value]="area.id"
                >{{ area.name }}</mat-option
              >
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="fill">
            <mat-label>Prerequisites</mat-label>
            <mat-select formControlName="prerequisites" multiple>
              <mat-option
                *ngFor="let prerequisite of prerequisites$ | async"
                [value]="prerequisite.id"
                >{{ prerequisite.name }}</mat-option
              >
            </mat-select>
          </mat-form-field>

          <button mat-stroked-button (click)="removeFromArray(operations, j)">
            <mat-icon>delete</mat-icon>
          </button>
        </div>
        <ng-template #templ2>
          <div
            cdkDropList
            class="example-list"
            (cdkDropListDropped)="drop(operations, $event)"
          >
            <div
              cdkDrag
              class="example-box"
              *ngFor="let control of operations.controls"
            >
              <div class="example-custom-placeholder" *cdkDragPlaceholder></div>
              <span>{{ control.get('name').value }}</span>
              <!--<span class="area">{{ lookupArea(control.get('area').value)?.name }}</span>-->
            </div>
          </div>
        </ng-template>
        <button
          *ngIf="editOperations"
          mat-stroked-button
          (click)="addOperation()"
        >
          <mat-icon>add</mat-icon> Add Operation
        </button>
        <button mat-flat-button (click)="editOperations = !editOperations">
          Toggle Operations Edit
        </button>
      </div>
    </form>
  `,
  styleUrls: ['./component-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ComponentFormComponent),
      multi: true,
    },
  ],
})
export class ComponentFormComponent
  implements OnInit, OnDestroy, ControlValueAccessor {
  // lookup subcomponents
  areas$ = of([]);
  subcomponents$ = of([]);
  prerequisites$ = of([]);
  destroyed$ = new Subject();
  sub: Subscription;

  editOperations = true;

  form = this.fb.group({
    id: [''],
    name: ['', Validators.required],
    description: [''],
    subcomponents: [[]],
    operations: this.fb.array([]),
  });

  get subcomponents() {
    return this.form.get('subcomponents') as FormControl;
  }

  get operations() {
    return this.form.get('operations') as FormArray;
  }

  writeValue(obj: any) {
    let { operations, ...rest } = obj;
    operations = obj.operations.map((value) => ({ value, editing: false }));
    this.form.patchValue({ operations, ...rest });
  }
  onChange = (val: any) => {};

  registerOnChange(fn) {
    this.onChange = fn;
    this.sub?.unsubscribe();
    this.sub = this.form.valueChanges
      .pipe(
        takeUntil(this.destroyed$),
        map(({ operations, ...rest }) => ({
          operations: operations.map((v) => v.value),
          ...rest,
        }))
      )
      .subscribe((value) => this.onChange(value));
  }

  onTouch = () => {};

  registerOnTouched(fn) {
    this.onTouch = fn;
  }

  constructor(public fb: FormBuilder) {}

  ngOnInit(): void {}

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  addOperation() {
    let lastOperationNum = 0;
    if (this.operations.controls.length > 0) {
      const { name } = this.operations.controls[
        this.operations.controls.length - 1
      ].value;
      lastOperationNum = +name.split(' ').slice(-1)[0] || 0;
    }
    this.operations.push(
      this.fb.group({
        id: [''],
        name: [`Operation ${lastOperationNum + 1}`],
        area: [],
        prerequisites: [[]],
      })
    );
  }

  removeFromArray(array: FormArray, index: number, confirm = false) {
    if (!confirm || window.confirm('Are you sure?')) {
      array.removeAt(index);
    }
  }

  drop(control: FormArray, event: CdkDragDrop<FormGroup[]>) {
    moveItemInArray(control.controls, event.previousIndex, event.currentIndex);
  }
}
