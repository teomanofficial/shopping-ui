import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { OrderItemResponseModel } from '@store/orders/models/order-item-response.model';

@Injectable({ providedIn: 'root' })
export class OrderItemsService {
  constructor(private readonly http: HttpClient) {
  }

  increment(orderId: string, productId: string): Observable<OrderItemResponseModel> {
    return this.http.put<OrderItemResponseModel>(`api/Orders/${orderId}/OrderItems/Increase`, { productId })
  }

  decrement(orderId: string, productId: string): Observable<OrderItemResponseModel> {
    return this.http.put<OrderItemResponseModel>(`api/Orders/${orderId}/OrderItems/Decrease`, { productId })
  }

  remove(orderId: string, productId: string) {
    return this.http.delete(`api/Orders/${orderId}/OrderItems/${productId}`)
  }
}
