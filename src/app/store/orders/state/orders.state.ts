import { tap } from 'rxjs/operators';
import { Action, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';

import { OrderStateModel } from '@store/orders/models/order-state.model';
import { createInitialEntityState, DataStateType } from '@core/store';
import { OrderResponseModel } from '@store/orders/models/order-response.model';
import { OrdersService } from '@store/orders/services/orders.service';
import { CreateOrder, CreateOrderSuccess } from '@store/orders/state/orders.actions';

@State<OrderStateModel>({
  name: 'orders',
  defaults: createInitialEntityState<OrderResponseModel, OrderStateModel>({ data: [] })
})
@Injectable()
export class OrdersState {
  constructor(private readonly ordersService: OrdersService) {
  }

  @Action(CreateOrder)
  dispatchCreateOrder(context: StateContext<OrderStateModel>, { request }: CreateOrder) {
    const { data, dataState } = context.getState();
    return this.ordersService.createOrder(request)
      .pipe(tap(order => {
        if (dataState !== DataStateType.notInitialized) {
          context.patchState({ data: [order, ...data] })
        }
        context.dispatch(new CreateOrderSuccess(order, request.productIds))
      }));
  }
}
