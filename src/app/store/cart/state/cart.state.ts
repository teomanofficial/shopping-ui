import { throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { Action, Selector, State, StateContext } from '@ngxs/store';

import { createInitialEntityState, DataStateType } from '@core/store';
import { CartStateModel } from '@store/cart/models/cart-state.model';
import { CartItemResponseModel } from '@store/cart/models/cart-item-response.model';
import { CreateOrIncrementCartItem, GetCartItemList, RemoveOrDecrementCartItem } from '@store/cart/state/cart.actions';
import { CartService } from '@store/cart/services/cart.service';
import { patch, updateItem } from '@ngxs/store/operators';


@State<CartStateModel>({
  name: 'cart',
  defaults: createInitialEntityState<CartItemResponseModel, CartStateModel>({ data: [] })
})
@Injectable()
export class CartState {
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

  constructor(private readonly cartService: CartService) {
  }

  @Action(GetCartItemList)
  dispatchGetCartItemList(context: StateContext<CartStateModel>) {
    context.patchState({ dataState: DataStateType.loading })
    return this.cartService.getList()
      .pipe(
        tap(data => context.patchState({ data, dataState: DataStateType.loadEnd })),
        catchError(err => {
          context.patchState({ dataState: DataStateType.loadFailed })
          return throwError(err);
        })
      );
  }

  @Action(CreateOrIncrementCartItem)
  dispatchCreateOrIncrementCartItem(context: StateContext<CartStateModel>, { productId }: CreateOrIncrementCartItem) {
    const { data } = context.getState();
    return this.cartService.incrementQuantity(productId)
      .pipe(tap(item => {
        const updatedItem = data.find(x => x.productId === productId);
        if (updatedItem) context.setState(patch({ data: updateItem<CartItemResponseModel>(x => x.productId === productId, item) }))
        else context.patchState({ data: [item, ...data] })
      }));
  }

  @Action(RemoveOrDecrementCartItem)
  dispatchRemoveOrDecrementCartItem(context: StateContext<CartStateModel>, { productId }: CreateOrIncrementCartItem) {
    const { data } = context.getState();
    return this.cartService.incrementQuantity(productId)
      .pipe(tap(item => context.patchState({ data: [item, ...data] })));
  }
}
