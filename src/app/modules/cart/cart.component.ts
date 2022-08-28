import { Observable, of, Subject } from 'rxjs';
import { finalize, map, takeUntil } from 'rxjs/operators';
import { MdbModalService } from 'mdb-angular-ui-kit/modal';
import { Actions, ofActionDispatched, Select, Store } from '@ngxs/store';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';

import { DataStateType } from '@core/store';
import { CartState } from '@store/cart/state/cart.state';
import { CreateOrder, CreateOrderSuccess } from '@store/orders/state/orders.actions';
import { CartItemResponseModel } from '@store/cart/models/cart-item-response.model';
import { ClearCart, CreateOrIncrementCartItem, RemoveOrDecrementCartItem } from '@store/cart/state/cart.actions';
import { PreviewOrderDialogComponent } from '@shared/components/preview-order-dialog/preview-order-dialog.component';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartComponent implements OnInit, OnDestroy {
  @Select(CartState.selectData)
  cartItems$: Observable<CartItemResponseModel[]>

  @Select(CartState.selectDataState)
  cartItemsDataState$: Observable<DataStateType>;

  selectedProductIds: string[] = [];
  cartActionLoading: boolean;
  quantityChangeLoading: boolean;

  private readonly destroyed$ = new Subject();

  constructor(
    private readonly store: Store,
    private readonly actions$: Actions,
    private readonly dialogService: MdbModalService,
    private readonly cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.registerSelectedCartItems();
    this.registerActionListeners();
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  trackByCartItem(_: number, item: CartItemResponseModel) {
    return item.productId;
  }

  private registerSelectedCartItems() {
    this.cartItems$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(items => {
        this.selectedProductIds = items.map(x => x.productId);
        this.cdr.markForCheck();
      });
  }

  registerActionListeners() {
    this.actions$.pipe(
      ofActionDispatched(CreateOrderSuccess),
      takeUntil(this.destroyed$)
    ).subscribe(({ order }: CreateOrderSuccess) => {
      this.dialogService.open(PreviewOrderDialogComponent, {
        data: { order },
        modalClass: 'modal-lg'
      })
    })
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
      .pipe(
        finalize(() => {
          this.cartActionLoading = false;
          this.cdr.markForCheck();
        }),
      )
      .subscribe();
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
