import { throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { createInitialEntityState, DataStateType } from '@core/store';

import { ProductStateModel } from '@store/products/models/product-state.model';
import { ProductResponseModel } from '@store/products/models/product-response.model';
import { GetProductList } from '@store/products/state/product.actions';
import { ProductsService } from '@store/products/services/products.service';

@State<ProductStateModel>({
  name: 'products',
  defaults: createInitialEntityState<ProductResponseModel, ProductStateModel>({
    data: [] as ProductResponseModel[]
  })
})
@Injectable({ providedIn: 'root' })
export class ProductState {
  constructor(private readonly productsService: ProductsService) {
  }

  @Selector()
  static selectProducts({ data }: ProductStateModel) {
    return data;
  }

  @Selector()
  static selectDataState({ dataState }: ProductStateModel) {
    return dataState;
  }

  @Action(GetProductList)
  dispatchGetProductList(context: StateContext<ProductStateModel>) {
    context.patchState({ dataState: DataStateType.loading })
    return this.productsService.getList()
      .pipe(
        tap(data => context.patchState({ data, dataState: DataStateType.loadEnd })),
        catchError(err => {
          context.patchState({ dataState: DataStateType.loadFailed })
          return throwError(err);
        })
      )
  }
}
