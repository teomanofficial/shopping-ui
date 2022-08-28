import { throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { patch, removeItem, updateItem } from '@ngxs/store/operators';
import { Action, Selector, State, StateContext } from '@ngxs/store';

import { CartService } from '@store/cart/services/cart.service';
import { createInitialEntityState, DataStateType } from '@core/store';
import { CartStateModel } from '@store/cart/models/cart-state.model';
import { CartItemResponseModel } from '@store/cart/models/cart-item-response.model';
import {
  ClearCart,
  CreateOrIncrementCartItem,
  GetCartItemList,
  RemoveOrDecrementCartItem
} from '@store/cart/state/cart.actions';
import { CreateOrderSuccess } from '@store/orders/state/orders.actions';


@State<CartStateModel>({
  name: 'cart',
  defaults: createInitialEntityState<CartItemResponseModel, CartStateModel>({ data: [] })
})
@Injectable()
export class CartState {
  constructor(private readonly cartService: CartService) {
  }

  @Selector()
  static selectData({ data }: CartStateModel) {
    return data;
  }

  @Selector()
  static selectCartItemCount({ data }: CartStateModel) {
    return data.reduce((t, i) => t + i.quantity, 0)
  }

  @Selector()
  static selectDataState({ dataState }: CartStateModel) {
    return dataState;
  }

  @Action(GetCartItemList)
  dispatchGetCartItemList(context: StateContext<CartStateModel>) {
    context.patchState({ dataState: DataStateType.loading })
    const { loadEnd, loadFailed, notFound } = DataStateType;
    return this.cartService.getList()
      .pipe(
        tap(data => context.patchState({ data, dataState: data.length ? loadEnd : notFound })),
        catchError(err => {
          context.patchState({ dataState: loadFailed })
          return throwError(err);
        })
      );
  }

  @Action(CreateOrIncrementCartItem)
  dispatchCreateOrIncrementCartItem(context: StateContext<CartStateModel>, { productId }: CreateOrIncrementCartItem) {
    const { data, dataState: currentDataState } = context.getState();
    return this.cartService.incrementQuantity(productId)
      .pipe(tap(item => {
        const updatedItem = data.find(x => x.productId === productId);
        const dataState = currentDataState !== DataStateType.loading ? DataStateType.loadEnd : DataStateType.loading;
        if (updatedItem) context.setState(patch({
          dataState,
          data: updateItem<CartItemResponseModel>(x => x.productId === productId, item),
        }))
        else context.patchState({ data: [item, ...data], dataState })
      }));
  }

  @Action(CreateOrderSuccess)
  dispatchCreateOrderSuccess(context: StateContext<CartStateModel>, { productIds }: CreateOrderSuccess) {
    const { data } = context.getState();
    context.patchState({ data: data.filter(x => !productIds.includes(x.productId)) });
    if (context.getState().data.length === 0) {
      context.patchState({ dataState: DataStateType.notFound })
    }
  }

  @Action(RemoveOrDecrementCartItem)
  dispatchRemoveOrDecrementCartItem(context: StateContext<CartStateModel>, { productId }: CreateOrIncrementCartItem) {
    const { data } = context.getState();
    return this.cartService.decrementQuantity(productId)
      .pipe(tap(() => {
        const item = data.find(x => x.productId === productId);
        if (item.quantity === 1) context.setState(patch({ data: removeItem<CartItemResponseModel>(x => x.productId === productId) }))
        else context.setState(patch({ data: updateItem<CartItemResponseModel>(x => x.productId === productId, patch({ quantity: item.quantity - 1 })) }))
        if (context.getState().data.length === 0) context.patchState({ dataState: DataStateType.notFound });
      }));
  }

  @Action(ClearCart)
  dispatchClearCart(context: StateContext<CartStateModel>) {
    return this.cartService.clearCart()
      .pipe(tap(() => context.patchState({ data: [], dataState: DataStateType.notFound })));
  }
}
