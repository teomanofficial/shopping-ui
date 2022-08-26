import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { DataStateType } from '@core/store';
import { CartState } from '@store/cart/state/cart.state';
import { CreateOrder } from '@store/orders/state/orders.actions';
import { CartItemResponseModel } from '@store/cart/models/cart-item-response.model';
import { ClearCart, CreateOrIncrementCartItem, RemoveOrDecrementCartItem } from '@store/cart/state/cart.actions';
import { Navigate } from '@ngxs/router-plugin';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartComponent implements OnInit {
  @Select(CartState.selectData)
  cartItems$: Observable<CartItemResponseModel[]>

  @Select(CartState.selectDataState)
  cartItemsDataState$: Observable<DataStateType>;

  selectedProductIds: string[] = [];
  cartActionLoading: boolean;
  quantityChangeLoading: boolean;

  constructor(
    private readonly store: Store,
    private readonly cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
  }

  trackByCartItem(_: number, item: CartItemResponseModel) {
    return item.productId;
  }

  onClearCartButtonClick() {
    this.cartActionLoading = true;
    this.store.dispatch(new ClearCart())
      .pipe(finalize(() => {
        this.cartActionLoading = false;
        this.cdr.markForCheck();
      }))
      .subscribe();
  }

  onIncrementButtonClick(productId: string) {
    this.quantityChangeLoading = true;
    this.store.dispatch(new CreateOrIncrementCartItem(productId))
      .pipe(finalize(() => {
        this.quantityChangeLoading = false;
        this.cdr.markForCheck();
      }))
      .subscribe();
  }

  onDecrementButtonClick(productId: string) {
    this.quantityChangeLoading = true;
    this.store.dispatch(new RemoveOrDecrementCartItem(productId))
      .pipe(finalize(() => {
        this.quantityChangeLoading = false;
        this.cdr.markForCheck();
      }))
      .subscribe();
  }

  onCreateOrderButtonClick() {
    this.cartActionLoading = true;
    this.store.dispatch(new CreateOrder({ productIds: this.selectedProductIds }))
      .pipe(finalize(() => {
        this.cartActionLoading = false;
        this.cdr.markForCheck();
      }))
      .subscribe(() => {
        this.store.dispatch(new Navigate(['/orders']));
        this.cdr.markForCheck();
      });
  }

  onProductCheckboxChange(productId: string) {
    this.selectedProductIds = this.selectedProductIds.includes(productId)
      ? this.selectedProductIds.filter(x => x !== productId)
      : [...this.selectedProductIds, productId]
  }

  getTotalCost() {
    return this.cartItems$
      .pipe(
        map((items: CartItemResponseModel[]) => items.filter(x => this.selectedProductIds.includes(x.productId))),
        map((items: CartItemResponseModel[]) => items.reduce((t, i) => t + i.quantity * i.product.price, 0))
      )
  }
}
