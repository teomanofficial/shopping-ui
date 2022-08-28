import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';

import { OrdersRoutingModule } from './orders-routing.module';
import { OrdersComponent } from './orders.component';
import { SharedModule } from '@shared/shared.module';
import { OrdersState } from '@store/orders/state/orders.state';
import { MdbAccordionModule } from 'mdb-angular-ui-kit/accordion';


@NgModule({
  declarations: [
    OrdersComponent
  ],
  imports: [
    CommonModule,
    OrdersRoutingModule,
    NgxsModule.forFeature([OrdersState]),
    SharedModule,
    MdbAccordionModule
  ]
})
export class OrdersModule {
}
