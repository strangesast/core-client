import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ObjectsMainPageComponent } from './containers/objects-main-page/objects-main-page.component';
import { ProductionScheduleComponent } from './components/production-schedule/production-schedule.component';
import { ManufacturingAreaFormComponent } from './components/manufacturing-area-form/manufacturing-area-form.component';
import { CustomerFormComponent } from './components/customer-form/customer-form.component';
import { ComponentFormComponent } from './components/component-form/component-form.component';
import { ManufacturingOrderFormComponent } from './components/manufacturing-order-form/manufacturing-order-form.component';

const routes: Routes = [{ path: '', component: ObjectsMainPageComponent }];

@NgModule({
  declarations: [
    ObjectsMainPageComponent,
    ProductionScheduleComponent,
    ManufacturingAreaFormComponent,
    CustomerFormComponent,
    ComponentFormComponent,
    ManufacturingOrderFormComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
  ],
})
export class ObjectsModule {}
