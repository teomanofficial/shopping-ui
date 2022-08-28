import { Store } from '@ngxs/store';
import { finalize } from 'rxjs/operators';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';

import { CompleteOrder } from '@store/orders/state/orders.actions';
import { OrderResponseModel } from '@store/orders/models/order-response.model';
import { OrderItemResponseModel } from '@store/orders/models/order-item-response.model';

@Component({
  selector: 'app-preview-order-dialog',
  templateUrl: './preview-order-dialog.component.html',
  styleUrls: ['./preview-order-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreviewOrderDialogComponent implements OnInit {
  @Input() order: OrderResponseModel;

  step: 'details' | 'items' = 'details';

  actionLoading: boolean;

  constructor(
    private readonly store: Store,
    private readonly cdr: ChangeDetectorRef,
    private readonly activeDialog: MdbModalRef<PreviewOrderDialogComponent>,
  ) {
  }

  ngOnInit(): void {
  }

  onCompleteOrderClick() {
    this.actionLoading = true;
    this.store.dispatch(new CompleteOrder(this.order.id))
      .pipe(finalize(() => {
        this.actionLoading = false;
        this.cdr.markForCheck();
      }))
      .subscribe(() => this.activeDialog.close());
  }

  onOrderItemIncreased(item: OrderItemResponseModel) {
    const index = this.order.orderItems.indexOf(item);
    this.order.orderItems[index] = { ...item, quantity: item.quantity + 1 };
    this.order.orderItems = [...this.order.orderItems];
    this.order.totalPrice += item.price;
    this.order = { ...this.order };

    console.log('onOrderItemIncreased', this.order);
  }

  onOrderItemDecreased(item: OrderItemResponseModel) {
    const index = this.order.orderItems.indexOf(item);
    this.order.orderItems[index] = { ...item, quantity: item.quantity - 1 };
    this.order.orderItems = [...this.order.orderItems];
    this.order.totalPrice -= item.price;
    this.order = { ...this.order };
  }

  orderItemRemoved(item: OrderItemResponseModel) {
    const index = this.order.orderItems.indexOf(item);
    this.order.orderItems.splice(index, 1);
    this.order.orderItems = [...this.order.orderItems];
    this.order.totalPrice -= item.price;
    this.order = { ...this.order };
  }
}
