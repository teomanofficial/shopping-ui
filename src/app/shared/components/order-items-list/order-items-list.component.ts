import { Store } from '@ngxs/store';
import { finalize } from 'rxjs/operators';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';

import { OrderItemResponseModel } from '@store/orders/models/order-item-response.model';
import { DecrementOrderItem, IncrementOrderItem, RemoveOrderItem } from '@store/orders/state/orders.actions';

@Component({
  selector: 'app-order-items-list',
  templateUrl: './order-items-list.component.html',
  styleUrls: ['./order-items-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderItemsListComponent implements OnInit {
  @Input() orderItems: OrderItemResponseModel[] = [];

  @Output() orderItemIncreased: EventEmitter<OrderItemResponseModel> = new EventEmitter();
  @Output() orderItemDecreased: EventEmitter<OrderItemResponseModel> = new EventEmitter();
  @Output() orderItemRemoved: EventEmitter<OrderItemResponseModel> = new EventEmitter();

  actionLoading: boolean;

  constructor(
    private readonly store: Store,
    private readonly cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
  }

  trackByOrderItem(_: number, item: OrderItemResponseModel) {
    return item.productId;
  }

  onIncrementButtonClick(item: OrderItemResponseModel) {
    const { quantity, orderId, productId } = item;
    if (quantity >= 10) return;
    this.actionLoading = true;
    this.store.dispatch(new IncrementOrderItem(orderId, productId))
      .pipe(finalize(() => {
        this.actionLoading = false;
        this.cdr.markForCheck();
      }))
      .subscribe(() => this.orderItemIncreased.emit(item));
  }

  onDecrementButtonClick(item: OrderItemResponseModel) {
    const { quantity, orderId, productId } = item;
    if (quantity <= 0) return;
    this.actionLoading = true;
    this.store.dispatch(new DecrementOrderItem(orderId, productId))
      .pipe(finalize(() => {
        this.actionLoading = false;
        this.cdr.markForCheck();
      }))
      .subscribe(() => this.orderItemDecreased.emit(item));
  }

  onDeleteOrderItemButtonClick(item: OrderItemResponseModel) {
    this.actionLoading = true;
    const { orderId, productId } = item;
    this.actionLoading = true;
    this.store.dispatch(new RemoveOrderItem(orderId, productId))
      .pipe(finalize(() => {
        this.actionLoading = false;
        this.cdr.markForCheck();
      }))
      .subscribe(() => this.orderItemRemoved.emit(item));
  }
}
