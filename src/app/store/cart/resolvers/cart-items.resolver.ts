import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { switchMap, take } from 'rxjs/operators';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { AuthState } from '@store/auth/state/auth.state';
import { GetCartItemList } from '@store/cart/state/cart.actions';
import { CartItemResponseModel } from '@store/cart/models/cart-item-response.model';

@Injectable({ providedIn: 'root' })
export class CartItemsResolver implements Resolve<CartItemResponseModel[]> {
  @Select(AuthState.selectIsLoggedIn)
  isLoggedIn$: Observable<boolean>

  constructor(private readonly store: Store) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<CartItemResponseModel[]> {
    return this.isLoggedIn$.pipe(
      switchMap(isLoggedIn => isLoggedIn ? this.store.dispatch(new GetCartItemList()) : of([])),
      take(1)
    )
  }
}
