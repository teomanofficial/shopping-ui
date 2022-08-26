import { NgxsModule } from '@ngxs/store';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CartRoutingModule } from './cart-routing.module';
import { CartComponent } from './cart.component';
import { SharedModule } from '@shared/shared.module';
import { OrdersState } from '@store/orders/state/orders.state';


@NgModule({
  declarations: [
    CartComponent
  ],
  imports: [
    CommonModule,
    CartRoutingModule,
    SharedModule,
    NgxsModule.forFeature([OrdersState]),
  ]
})
export class CartModule {
}
