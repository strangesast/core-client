import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-production-schedule',
  template: `
    <form [formGroup]="form">
      <section formArrayName="areas">
        <h2>Manufacturing Areas</h2>
        <div *ngFor="let control of areas.controls; index as i">
          <div [formGroupName]="i" class="form-group">
            <mat-form-field appearance="fill">
              <mat-label>Area Name</mat-label>
              <input formControlName="name" matInput placeholder="Stage 1" />
              <mat-hint>A descriptive name</mat-hint>
            </mat-form-field>
            <div>
              <button mat-stroked-button (click)="removeFromArray(areas, i)">
                Remove
              </button>
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
          class="form-group"
          [class.minimized]="control.value.minimized"
        >
          <ng-container *ngIf="!control.value.minimized; else templ">
            <mat-form-field appearance="fill">
              <mat-label>Name</mat-label>
              <input
                formControlName="name"
                matInput
                placeholder="Product Name"
              />
              <mat-hint>A catchy name</mat-hint>
            </mat-form-field>
            <mat-form-field appearance="fill">
              <mat-label>Description</mat-label>
              <textarea formControlName="description" matInput></textarea>
            </mat-form-field>
            <mat-form-field appearance="fill">
              <mat-label>Subcomponents</mat-label>
              <mat-select
                formControlName="subcomponents"
                multiple
                [disabled]="validSubcomponents(control).length == 0"
              >
                <mat-select-trigger>
                  {{
                    control.get('subcomponents').value
                      ? control.get('subcomponents').value.length
                      : 0
                  }}
                  Components
                </mat-select-trigger>
                <mat-option
                  *ngFor="let component of validSubcomponents(control)"
                  [value]="component.id"
                  >{{ component.name }}</mat-option
                >
              </mat-select>
            </mat-form-field>
            <div formGroupName="operations">
              <div
                formArrayName="values"
                class="form-list"
                *ngIf="control.get('operations.editing').value; else templ2"
              >
                <div
                  *ngFor="
                    let subcontrol of control.get('operations.values').controls;
                    let j = index
                  "
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
                        *ngFor="let area of areas.value"
                        [value]="area.id"
                        >{{ area.name }}</mat-option
                      >
                    </mat-select>
                  </mat-form-field>
                  <mat-form-field appearance="fill">
                    <mat-label>Prerequisites</mat-label>
                    <mat-select formControlName="prerequisites" multiple>
                      <mat-option
                        *ngFor="
                          let prerequisite of validPrerequisites(subcontrol)
                        "
                        [value]="prerequisite.id"
                        >{{ prerequisite.name }}</mat-option
                      >
                    </mat-select>
                  </mat-form-field>

                  <button
                    mat-stroked-button
                    (click)="
                      removeFromArray(control.get('operations.values'), j)
                    "
                  >
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
              </div>
              <ng-template #templ2>
                <div
                  cdkDropList
                  class="example-list"
                  (cdkDropListDropped)="
                    drop(control.get('operations.values'), $event)
                  "
                >
                  <div
                    cdkDrag
                    class="example-box"
                    *ngFor="
                      let control of control.get('operations.values').controls
                    "
                  >
                    <div
                      class="example-custom-placeholder"
                      *cdkDragPlaceholder
                    ></div>
                    <span>{{ control.get('name').value }}</span>
                    <span class="area">{{
                      lookupArea(control.get('area').value)?.name
                    }}</span>
                  </div>
                </div>
              </ng-template>
              <button
                *ngIf="control.get('operations.editing').value"
                mat-stroked-button
                (click)="addComponentOperation(control)"
              >
                <mat-icon>add</mat-icon> Add Operation
              </button>
              <button
                mat-stroked-button
                (click)="toggleOperationsEdit(control)"
              >
                Toggle Operations Edit
              </button>
            </div>
          </ng-container>
          <ng-template #templ>
            <span>{{ control.value.name }}</span>
            <span *ngIf="control.get('subcomponents').value.length as length"
              >{{ length }} Subcomponents</span
            >
            <span
              *ngIf="control.get('operations.values').value.length as length"
              >{{ length }} Operations</span
            >
            <span class="spacer"></span>
          </ng-template>
          <div>
            <button mat-stroked-button (click)="removeFromArray(components, i)">
              <mat-icon>delete</mat-icon>
            </button>
            <button mat-icon-button (click)="toggleMinification(components, i)">
              <mat-icon>{{ isMinimized(control) ? 'add' : 'remove' }}</mat-icon>
            </button>
          </div>
          <mat-divider></mat-divider>
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
    </form>
  `,
  styleUrls: ['./production-schedule.component.scss'],
})
export class ProductionScheduleComponent implements OnInit {
  lastID = 0;

  form = this.fb.group({
    areas: this.fb.array([
      this.fb.group({
        name: ['Stage 1', Validators.required],
        id: [++this.lastID, Validators.required],
        minimized: false,
      }),
    ]),
    components: this.fb.array([
      this.fb.group({
        name: ['Product A', Validators.required],
        description: [''],
        subcomponents: [[]],
        id: ++this.lastID,
        minimized: false,
        operations: this.fb.group({
          editing: true,
          values: this.fb.array([]),
        }),
      }),
    ]),
  });

  get areas() {
    return this.form.get('areas') as FormArray;
  }

  get components() {
    return this.form.get('components') as FormArray;
  }

  createNewArea() {
    this.areas.push(
      this.fb.group({
        id: ++this.lastID,
        name: 'New Area',
        minimized: false,
      })
    );
  }

  createNewComponent() {
    this.components.push(
      this.fb.group({
        id: [++this.lastID],
        name: ['New Product'],
        description: [''],
        subcomponents: [[]],
        minimized: false,
        operations: this.fb.group({
          editing: true,
          values: this.fb.array([]),
        }),
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

  removeFromArray(array: FormArray, index: number) {
    array.removeAt(index);
  }

  constructor(public fb: FormBuilder) {}

  ngOnInit(): void {}

  validSubcomponents(control) {
    const component = control.value;
    return this.components.value.filter((v) => v.id != component.id);
  }

  validPrerequisites(control) {
    return control.parent.value.filter((c) => c.id != control.value.id);
  }

  toggleMinification(component: FormArray, index: number) {
    const control = component.controls[index];
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
