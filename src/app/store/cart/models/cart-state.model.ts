import { EntityStateModel } from '@core/store';
import { CartItemResponseModel } from '@store/cart/models/cart-item-response.model';

export interface CartStateModel extends EntityStateModel<CartItemResponseModel> {
}
