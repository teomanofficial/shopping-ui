import { throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { Action, Selector, State, StateContext } from '@ngxs/store';

import { OrderStateModel } from '@store/orders/models/order-state.model';
import { createInitialEntityState, DataStateType } from '@core/store';
import { OrderResponseModel } from '@store/orders/models/order-response.model';
import { OrdersService } from '@store/orders/services/orders.service';
import * as OrderActions from '@store/orders/state/orders.actions';
import { patch, removeItem, updateItem } from '@ngxs/store/operators';
import { OrderItemResponseModel } from '@store/orders/models/order-item-response.model';
import { OrderItemsService } from '@store/orders/services/order-items.service';
import { OrderStatus } from '@store/orders/enums/order-status.enum';

@State<OrderStateModel>({
  name: 'orders',
  defaults: createInitialEntityState<OrderResponseModel, OrderStateModel>({ data: [] })
})
@Injectable()
export class OrdersState {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly orderItemService: OrderItemsService
  ) {
  }

  @Selector()
  static selectData({ data }: OrderStateModel) {
    return data;
  }

  @Selector()
  static selectDataState({ dataState }: OrderStateModel) {
    return dataState;
  }

  @Action(OrderActions.GetOrderList)
  dispatchGetOrderList(context: StateContext<OrderStateModel>) {
    context.patchState({ dataState: DataStateType.loading });
    return this.ordersService.getList()
      .pipe(
        tap(data => context.patchState({
          data,
          dataState: data.length ? DataStateType.loadEnd : DataStateType.notFound
        })),
        catchError(err => {
          context.patchState({ dataState: DataStateType.loadFailed });
          return throwError(err);
        })
      );
  }

  @Action(OrderActions.CreateOrder)
  dispatchCreateOrder(context: StateContext<OrderStateModel>, { request }: OrderActions.CreateOrder) {
    const { data, dataState } = context.getState();
    return this.ordersService.createOrder(request)
      .pipe(tap(order => {
        if (dataState !== DataStateType.notInitialized) {
          context.patchState({ data: [order, ...data] })
        }
        context.dispatch(new OrderActions.CreateOrderSuccess(order, request.productIds))
      }));
  }

  @Action(OrderActions.CompleteOrder)
  dispatchCompleteOrder(context: StateContext<OrderStateModel>, { orderId }: OrderActions.CompleteOrder) {
    const { dataState } = context.getState();
    return this.ordersService.completeOrder(orderId)
      .pipe(tap(order => {
        if (dataState === DataStateType.loadEnd) {
          context.setState(patch({
            data: updateItem<OrderResponseModel>(
              x => x.id === orderId,
              patch({ status: OrderStatus.submitted }
              ))
          }))
        }
      }));
  }

  @Action(OrderActions.IncrementOrderItem)
  dispatchIncrementOrderItem(context: StateContext<OrderStateModel>, {
    orderId,
    productId
  }: OrderActions.IncrementOrderItem) {
    const { data, dataState } = context.getState();
    return this.orderItemService.increment(orderId, productId)
      .pipe(tap(item => {
        if (dataState === DataStateType.loadEnd) {
          const order = data.find(x => x.id === orderId);
          context.setState(patch({
            data: updateItem<OrderResponseModel>(
              x => x.id === orderId,
              patch({
                totalPrice: order.totalPrice + item.price,
                orderItems: updateItem<OrderItemResponseModel>(
                  x => x.productId === productId,
                  patch({ quantity: item.quantity })
                )
              })
            )
          }))
        }
      }));
  }

  @Action(OrderActions.DecrementOrderItem)
  dispatchDecrementOrderItem(context: StateContext<OrderStateModel>, {
    orderId,
    productId
  }: OrderActions.DecrementOrderItem) {
    const { data, dataState } = context.getState();
    return this.orderItemService.decrement(orderId, productId)
      .pipe(tap(item => {
        if (dataState === DataStateType.loadEnd) {
          const order = data.find(x => x.id === orderId);
          context.setState(patch({
            data: updateItem<OrderResponseModel>(
              x => x.id === orderId,
              patch({
                totalPrice: order.totalPrice - item.price,
                orderItems: item.quantity === 0
                  ? removeItem<OrderItemResponseModel>(x => x.productId === productId)
                  : updateItem<OrderItemResponseModel>(x => x.productId === productId, patch({ quantity: item.quantity }))
              })
            )
          }))
        }
      }));
  }

  @Action(OrderActions.RemoveOrderItem)
  dispatchRemoveOrderItem(context: StateContext<OrderStateModel>, {
    orderId,
    productId
  }: OrderActions.RemoveOrderItem) {
    const { data, dataState } = context.getState();
    return this.orderItemService.remove(orderId, productId)
      .pipe(tap(() => {
        if (dataState === DataStateType.loadEnd) {
          const order = data.find(x => x.id === orderId);
          const orderItem = order.orderItems.find(x => x.productId === productId);
          context.setState(patch({
            data: updateItem<OrderResponseModel>(
              x => x.id === orderId,
              patch({
                totalPrice: order.totalPrice - orderItem.price * orderItem.quantity,
                orderItems: removeItem<OrderItemResponseModel>(x => x.productId === productId)
              })
            )
          }))
        }
      }));
  }
}
