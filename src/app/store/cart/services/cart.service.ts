import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { CartItemResponseModel } from '@store/cart/models/cart-item-response.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  constructor(private readonly http: HttpClient) {
  }

  getList(): Observable<CartItemResponseModel[]> {
    return this.http.get<CartItemResponseModel[]>('api/Cart')
  }

  incrementQuantity(productId: string) {
    return this.http.put<CartItemResponseModel>('api/Cart/CreateOrIncrement', { productId })
  }

  decrementQuantity(productId: string) {
    return this.http.put<CartItemResponseModel>('api/Cart/RemoveOrDecrement', { productId })
  }

  clearCart() {
    return this.http.delete<CartItemResponseModel>('api/Cart')
  }
}

