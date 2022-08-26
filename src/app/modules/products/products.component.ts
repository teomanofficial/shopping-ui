import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { Component, OnInit } from '@angular/core';

import { GetProductList } from '@store/products/state/product.actions';
import { ProductState } from '@store/products/state/product.state';
import { ProductResponseModel } from '@store/products/models/product-response.model';
import { CreateOrIncrementCartItem } from '@store/cart/state/cart.actions';
import { DataStateType } from '@core/store';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  @Select(ProductState.selectProducts)
  products$: Observable<ProductResponseModel[]>;

  @Select(ProductState.selectDataState)
  productsDataState$: Observable<DataStateType>;

  constructor(
    private readonly store: Store
  ) {
  }

  ngOnInit(): void {
    this.registerProductList();
  }

  private registerProductList() {
    this.store.dispatch(new GetProductList());
  }

  onAddCartClick(productId: string) {
    this.store.dispatch(new CreateOrIncrementCartItem(productId));
  }
}
