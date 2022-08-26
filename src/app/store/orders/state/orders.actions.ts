import { CreateOrderRequestModel } from '@store/orders/models/create-order-request.model';
import { OrderResponseModel } from '@store/orders/models/order-response.model';

export class CreateOrder {
  static readonly type = '[Orders] Create Order';

  constructor(public readonly request: CreateOrderRequestModel) {
  }
}

export class CreateOrderSuccess {
  static readonly type = '[Orders] Create Order Success';

  constructor(public readonly order: OrderResponseModel, public readonly productIds: string[]) {
  }
}
