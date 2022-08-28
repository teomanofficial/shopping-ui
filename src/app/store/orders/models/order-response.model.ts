import { OrderItemResponseModel } from '@store/orders/models/order-item-response.model';
import { OrderStatus } from '@store/orders/enums/order-status.enum';

export interface OrderResponseModel {
  id: string;
  userId: string;
  code: string;
  status: OrderStatus;
  totalPrice: number;
  createdAt: string;
  orderItems: OrderItemResponseModel[];
}
