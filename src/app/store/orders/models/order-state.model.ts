import { EntityStateModel } from '@core/store';
import { OrderResponseModel } from '@store/orders/models/order-response.model';

export interface OrderStateModel extends EntityStateModel<OrderResponseModel> {
}
