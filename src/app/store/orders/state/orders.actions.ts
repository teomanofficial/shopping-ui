import { CreateOrderRequestModel } from '@store/orders/models/create-order-request.model';
import { OrderResponseModel } from '@store/orders/models/order-response.model';

export class GetOrderList {
  static readonly type = '[Orders] Get Order List';
}

export class CreateOrder {
  static readonly type = '[Orders] Create Order';

  constructor(public readonly request: CreateOrderRequestModel) {
  }
}

export class CompleteOrder {
  static readonly type = '[Orders] Complete Order';

  constructor(public readonly orderId: string) {
  }
}

export class IncrementOrderItem {
  static readonly type = '[Orders] Increment Order Item';

  constructor(
    public readonly orderId: string,
    public readonly productId: string,
  ) {
  }
}

export class DecrementOrderItem {
  static readonly type = '[Orders] Decrement Order Item';

  constructor(
    public readonly orderId: string,
    public readonly productId: string
  ) {
  }
}

export class RemoveOrderItem {
  static readonly type = '[Orders] Remove Order Item';

  constructor(
    public readonly orderId: string,
    public readonly productId: string
  ) {
  }
}

export class CreateOrderSuccess {
  static readonly type = '[Orders] Create Order Success';

  constructor(public readonly order: OrderResponseModel, public readonly productIds: string[]) {
  }
}
