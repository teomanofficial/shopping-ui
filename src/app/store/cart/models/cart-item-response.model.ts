import { ProductResponseModel } from '@store/products/models/product-response.model';

export interface CartItemResponseModel {
  userId: string;
  productId: string;
  quantity: number;
  product: ProductResponseModel
}
