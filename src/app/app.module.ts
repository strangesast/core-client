import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PortalModule } from '@angular/cdk/portal';

import { MaterialModule } from './material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainComponent } from './main/main.component';
import { SummaryPageComponent } from './summary-page/summary-page.component';
import { TimeclockPageComponent } from './timeclock-page/timeclock-page.component';
import { MachinesPageComponent } from './machines-page/machines-page.component';
import { ActivityCountPreviewComponent } from './activity-count-preview/activity-count-preview.component';
import { MachinePageComponent } from './machine-page/machine-page.component';
import { MapViewerComponent } from './map-viewer/map-viewer.component';
import { PersonPageComponent } from './person-page/person-page.component';
import { PersonListPageComponent } from './person-list-page/person-list-page.component';
import { OrderListPageComponent } from './order-list-page/order-list-page.component';
import { OrderPageComponent } from './order-page/order-page.component';
import { GraphQLModule } from './graphql.module';
import { PartListPageComponent } from './part-list-page/part-list-page.component';
import { CustomerListPageComponent } from './customer-list-page/customer-list-page.component';
import { PartPageComponent } from './part-page/part-page.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { UserAccountPageComponent } from './user-account-page/user-account-page.component';
import { TimeclockTableComponent } from './timeclock-table/timeclock-table.component';
import { TimeclockStaggeredComponent } from './timeclock-staggered/timeclock-staggered.component';
import { TimeclockDatepickerComponent } from './timeclock-datepicker/timeclock-datepicker.component';
import { PieComponent } from './pie/pie.component';
import { LayoutComponent } from './layout/layout.component';
import { PageTitleComponent } from './page-title/page-title.component';
import { InventoryPageComponent } from './inventory-page/inventory-page.component';
import { NotificationsPageComponent } from './notifications-page/notifications-page.component';
import { NotificationListComponent } from './notification-list/notification-list.component';
import { BrandComponent } from './brand/brand.component';
import { CreateAccountPageComponent } from './create-account-page/create-account-page.component';
import { LoginBasePageComponent } from './login-base-page/login-base-page.component';
import { TimeclockShiftDialogComponent } from './timeclock-shift-dialog/timeclock-shift-dialog.component';
import { DurationPipe } from './duration.pipe';
import { TimeclockGraphsContainerPageComponent } from './timeclock-graphs-container-page/timeclock-graphs-container-page.component';
import { NoopComponent } from './noop/noop.component';
import { ActiveOrdersPageComponent } from './active-orders-page/active-orders-page.component';
import { CustomerPageComponent } from './customer-page/customer-page.component';


@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    SummaryPageComponent,
    TimeclockPageComponent,
    MachinesPageComponent,
    ActivityCountPreviewComponent,
    MachinePageComponent,
    MapViewerComponent,
    PersonPageComponent,
    PersonListPageComponent,
    OrderListPageComponent,
    OrderPageComponent,
    PartListPageComponent,
    CustomerListPageComponent,
    PartPageComponent,
    ToolbarComponent,
    LoginPageComponent,
    UserAccountPageComponent,
    TimeclockTableComponent,
    TimeclockStaggeredComponent,
    TimeclockDatepickerComponent,
    PieComponent,
    LayoutComponent,
    PageTitleComponent,
    InventoryPageComponent,
    NotificationsPageComponent,
    NotificationListComponent,
    BrandComponent,
    CreateAccountPageComponent,
    LoginBasePageComponent,
    TimeclockShiftDialogComponent,
    DurationPipe,
    TimeclockGraphsContainerPageComponent,
    NoopComponent,
    ActiveOrdersPageComponent,
    CustomerPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    GraphQLModule,
    PortalModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }