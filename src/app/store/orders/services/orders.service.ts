import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { OrderResponseModel } from '@store/orders/models/order-response.model';
import { CreateOrderRequestModel } from '@store/orders/models/create-order-request.model';

@Injectable({ providedIn: 'root' })
export class OrdersService {
  constructor(private readonly http: HttpClient) {
  }

  getList(): Observable<OrderResponseModel[]> {
    return this.http.get<OrderResponseModel[]>('api/Orders')
  }

  createOrder(request: CreateOrderRequestModel) {
    return this.http.post<OrderResponseModel>('api/Orders', request)
  }

  completeOrder(orderId: string) {
    return this.http.put<OrderResponseModel>(`api/Orders/${orderId}/Complete`, {})
  }
}
