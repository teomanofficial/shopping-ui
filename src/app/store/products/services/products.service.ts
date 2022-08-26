import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductResponseModel } from '@store/products/models/product-response.model';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  constructor(private readonly http: HttpClient) {
  }

  getList(): Observable<ProductResponseModel[]> {
    return this.http.get<ProductResponseModel[]>('api/Products')
  }
}
