import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  trigger,
  state,
  transition,
  style,
  animate,
} from '@angular/animations';

import { ObjectsService } from '../../services/objects.service';
import { Subject } from 'rxjs';
import { takeUntil, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-production-schedule',
  template: `
    <form [formGroup]="form">
      <section formArrayName="areas">
        <h2>Manufacturing Areas</h2>
        <div
          *ngFor="let control of areas.controls; index as i"
          class="record"
          [formGroupName]="i"
          [class.minimized]="control.get('minimized')?.value"
        >
          <div class="header">
            <span>{{ control.get('value')?.value.name }}</span>
            <span class="spacer"></span>
            <div>
              <button mat-icon-button (click)="removeFromArray(areas, i, true)">
                <mat-icon>delete</mat-icon>
              </button>
            </div>
            <div>
              <button mat-icon-button (click)="toggleMinification(control)">
                <mat-icon>remove</mat-icon>
              </button>
            </div>
          </div>
          <div class="content" *ngIf="!control.get('minimized')?.value" @expand>
            <div>
              <app-manufacturing-area-form
                formControlName="value"
              ></app-manufacturing-area-form>
            </div>
          </div>
        </div>
        <div>
          <button mat-stroked-button type="button" (click)="createNewArea()">
            <mat-icon>add</mat-icon> Add New Area
          </button>
        </div>
      </section>
      <section formArrayName="components">
        <h2>Components</h2>
        <div
          *ngFor="let control of components.controls; index as i"
          [formGroupName]="i"
          class="record"
          [class.minimized]="control.get('minimized').value"
        >
          <div class="header">
            <span>{{ control.get('value').value.name }}</span>
            <span
              *ngIf="control.get('value').value.subcomponents?.length as length"
              class="sub"
              >{{ length }} Subcomponents</span
            >
            <span
              *ngIf="control.get('value').value.operations?.length as length"
              class="sub"
              >{{ length }} Operations</span
            >
            <span class="spacer"></span>
            <button
              mat-icon-button
              (click)="removeFromArray(components, i, true)"
            >
              <mat-icon>delete</mat-icon>
            </button>
            <button mat-icon-button (click)="toggleMinification(control)">
              <mat-icon>remove</mat-icon>
            </button>
          </div>
          <div class="content" *ngIf="!control.value.minimized" @expand>
            <div>
              <app-component-form formControlName="value"></app-component-form>
            </div>
          </div>
        </div>
        <div>
          <button
            mat-stroked-button
            type="button"
            (click)="createNewComponent()"
          >
            <mat-icon>add</mat-icon> Add New Component
          </button>
        </div>
      </section>
      <section formArrayName="customers">
        <h2>Customers</h2>
        <div
          *ngFor="let control of customers.controls; index as i"
          class="record"
          [class.minimized]="control.get('minimized')?.value"
          [formGroupName]="i"
        >
          <div class="header">
            <span>{{ control.get('value').value.name }}</span>
            <span class="spacer"></span>
            <button
              mat-icon-button
              (click)="removeFromArray(customers, i, true)"
            >
              <mat-icon>delete</mat-icon>
            </button>
            <button mat-icon-button (click)="toggleMinification(control)">
              <mat-icon>remove</mat-icon>
            </button>
          </div>
          <div class="content" *ngIf="!control.get('minimized')?.value" @expand>
            <div>
              <app-customer-form formControlName="value"></app-customer-form>
            </div>
          </div>
        </div>
        <div>
          <button
            mat-stroked-button
            type="button"
            (click)="createNewCustomer()"
          >
            <mat-icon>add</mat-icon> Add New Customer
          </button>
        </div>
      </section>
      <section formArrayName="manufacturingOrders">
        <h2>Manufacturing Orders</h2>
        <div
          *ngFor="let control of manufacturingOrders.controls; index as i"
          class="record"
          [class.minimized]="control.get('minimized')?.value"
          [formGroupName]="i"
        >
          <div class="header">
            <span
              >Component:
              {{ control.get('value').value.component?.name || 'None' }}</span
            >
            <span class="spacer"></span>
            <button
              mat-icon-button
              (click)="removeFromArray(manufacturingOrders, i, true)"
            >
              <mat-icon>delete</mat-icon>
            </button>
            <button mat-icon-button (click)="toggleMinification(control)">
              <mat-icon>remove</mat-icon>
            </button>
          </div>
          <div class="content" *ngIf="!control.get('minimized')?.value" @expand>
            <div>
              <app-manufacturing-order-form
                formControlName="value"
              ></app-manufacturing-order-form>
            </div>
          </div>
        </div>
        <div>
          <button
            mat-stroked-button
            type="button"
            (click)="createNewManufacturingOrder()"
          >
            <mat-icon>add</mat-icon> Add New Manufacturing Order
          </button>
        </div>
      </section>
    </form>
  `,
  styleUrls: ['./production-schedule.component.scss'],
  animations: [
    trigger('expand', [
      state('void', style({ height: '0px', minHeight: '0' })),
      state('*', style({ height: '*' })),
      transition('* => *', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ProductionScheduleComponent implements OnInit, OnDestroy {
  destroyed$ = new Subject();
  lastID = 0;

  form = this.fb.group({
    areas: this.fb.array([
      this.fb.group({
        value: [{ name: 'Stage 1', id: 'stage_1' }, Validators.required],
        minimized: [true],
      }),
    ]),
    components: this.fb.array([
      this.fb.group({
        value: [
          {
            id: 'product_a',
            name: 'Product A',
            description: '',
            subcomponents: [],
            operations: [],
          },
          Validators.required,
        ],
        minimized: [true],
      }),
    ]),
    customers: this.fb.array([
      this.fb.group({
        value: {
          name: 'Customer 123',
          address: {
            line1: '',
            line2: '',
            city: 'East Aurora',
            state: 'NY',
            zip: '14052',
          },
          phone: '716-555-5555',
          contact: 'John Doe',
        },
        minimized: true,
      }),
    ]),
    manufacturingOrders: this.fb.array([
      this.fb.group({
        value: [{
          component: null,
        }],
        minimized: false,
      }),
    ]),
  });

  get areas() {
    return this.form.get('areas') as FormArray;
  }

  get components() {
    return this.form.get('components') as FormArray;
  }

  get customers() {
    return this.form.get('customers') as FormArray;
  }

  get manufacturingOrders() {
    return this.form.get('manufacturingOrders') as FormArray;
  }

  createNewArea() {
    this.areas.push(
      this.fb.group({
        value: [
          {
            id: 'new-area',
            name: 'New Area',
          },
        ],
        minimized: [false],
      })
    );
  }

  createNewComponent() {
    this.components.push(
      this.fb.group({
        value: {
          id: 'new-product',
          name: 'New Product',
          description: '',
          subcomponents: [],
          operations: [],
        },
        minimized: false,
      })
    );
  }

  createNewCustomer() {
    this.customers.push(
      this.fb.group({
        value: {
          id: 'new-customer',
          name: 'New Customer',
          address: {},
        },
        minimized: false,
      })
    );
  }

  createNewManufacturingOrder() {
    this.manufacturingOrders.push(
      this.fb.group({
        value: [
          {
            id: 'manufacturing-order-0',
            component: null,
          },
          Validators.required,
        ],
        minimized: [false],
      })
    );
  }

  addComponentOperation(control) {
    const operations = control.get('operations.values') as FormArray;
    let lastOperationNum = 0;
    if (operations.controls.length > 0) {
      const { name } = operations.controls[
        operations.controls.length - 1
      ].value;
      lastOperationNum = +name.split(' ').slice(-1)[0] || 0;
    }
    operations.push(
      this.fb.group({
        id: [++this.lastID],
        name: [`Operation ${lastOperationNum + 1}`],
        area: [],
        prerequisites: [[]],
      })
    );
  }

  lookupArea(id: string) {
    return this.areas.value.find((area) => area.id === id);
  }

  removeFromArray(array: FormArray, index: number, confirm = false) {
    if (!confirm || window.confirm('Are you sure?')) {
      array.removeAt(index);
    }
  }

  constructor(public fb: FormBuilder, public service: ObjectsService) {}

  ngOnInit() {
    this.form.valueChanges
      .pipe(startWith(this.form.value), takeUntil(this.destroyed$))
      .subscribe((value) => {
        let obj = this.service.data$.getValue();
        for (const [key, arr] of Object.entries(value)) {
          obj = { ...obj, [key]: arr };
        }
        this.service.data$.next(obj);
      });
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  validSubcomponents(control) {
    const component = control.value;
    return this.components.value.filter((v) => v.id != component.id);
  }

  validPrerequisites(control) {
    return control.parent.value.filter((c) => c.id != control.value.id);
  }

  toggleMinification(control: FormGroup) {
    control.patchValue({ minimized: !control.value.minimized });
  }

  toggleOperationsEdit(control) {
    const cv = control.get('operations.editing').value;
    control.get('operations').patchValue({ editing: !cv });
  }

  isMinimized(control: FormGroup) {
    return !!control.value.minimized;
  }

  drop(control: FormArray, event: CdkDragDrop<FormGroup[]>) {
    moveItemInArray(control.controls, event.previousIndex, event.currentIndex);
  }
}
