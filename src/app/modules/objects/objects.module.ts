import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ObjectsMainPageComponent } from './containers/objects-main-page/objects-main-page.component';
import { ProductionScheduleComponent } from './components/production-schedule/production-schedule.component';

const routes: Routes = [{ path: '', component: ObjectsMainPageComponent }];

@NgModule({
  declarations: [ObjectsMainPageComponent, ProductionScheduleComponent],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
  ],
})
export class ObjectsModule {}
