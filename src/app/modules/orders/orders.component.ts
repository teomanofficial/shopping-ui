import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map, share } from 'rxjs/operators';
import { MdbModalService } from 'mdb-angular-ui-kit/modal';

import { DataStateType } from '@core/store';
import { OrderResponseModel } from '@store/orders/models/order-response.model';
import { OrdersState } from '@store/orders/state/orders.state';
import { GetOrderList } from '@store/orders/state/orders.actions';
import { OrderStatus } from '@store/orders/enums/order-status.enum';
import { PreviewOrderDialogComponent } from '@shared/components/preview-order-dialog/preview-order-dialog.component';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrdersComponent implements OnInit {
  @Select(OrdersState.selectData)
  orders$: Observable<OrderResponseModel[]>;

  @Select(OrdersState.selectDataState)
  ordersDataState$: Observable<DataStateType>;

  orderStatus = OrderStatus

  constructor(
    private readonly store: Store,
    private readonly dialogService: MdbModalService,
  ) {
  }

  ngOnInit(): void {
    this.getDataList();
  }

  private getDataList() {
    this.store.dispatch(new GetOrderList())
  }

  onCompleteOrderButtonClick(order: OrderResponseModel) {
    this.dialogService.open(PreviewOrderDialogComponent, {
      data: { order },
      modalClass: 'modal-lg'
    })
  }
}
