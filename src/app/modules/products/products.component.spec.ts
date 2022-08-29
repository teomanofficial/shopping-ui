import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsComponent } from './products.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Actions, NgxsModule, ofActionDispatched, Store } from '@ngxs/store';
import { ProductState } from '@store/products/state/product.state';
import { By } from '@angular/platform-browser';
import { ChangeDetectionStrategy } from '@angular/core';
import { ProductStateModel } from '@store/products/models/product-state.model';
import { DataStateType } from '@core/store';
import { CreateOrIncrementCartItem } from '@store/cart/state/cart.actions';
import { take } from 'rxjs/operators';
import { ProductCardComponent } from '@shared/components/product-card/product-card.component';

const PRODUCT_STATE: ProductStateModel = {
  data: [
    { id: '08ad0212-4efa-42ca-9cfd-a11de94dab68', price: 100, name: 'Test 1' },
    { id: 'caadd766-4fba-4c74-8ba3-6c748eed75c8', price: 125, name: 'Test 2' },
    { id: '049953ce-c65a-474f-a3a1-250b4d51e9a3', price: 150, name: 'Test 3' },
  ],
  dataState: DataStateType.loadEnd
}

describe('ProductsComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;
  let store: Store;
  let actions$: Actions;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductsComponent, ProductCardComponent],
      imports: [
        HttpClientTestingModule,
        NgxsModule.forRoot([ProductState])
      ]
    })
      .overrideComponent(ProductsComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default }
      })
      .compileComponents();
    store = TestBed.inject(Store);
    store.reset({
      ...store.snapshot(),
      products: PRODUCT_STATE
    });
    actions$ = TestBed.inject(Actions);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have page title', () => {
    expect(fixture.debugElement.query(By.css('#products-page-title'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('#products-page-title')).nativeElement.textContent).toBe('Products');
  });

  it('should show products', () => {
    const productCarts = fixture.debugElement.queryAll(By.css('app-product-card'));
    expect(productCarts.length).toBe(PRODUCT_STATE.data.length);
  });

  it('should dispatch create or increment cart item when add cart item button click', () => {
    const [product] = PRODUCT_STATE.data;
    const productCart = fixture.debugElement.query(By.directive(ProductCardComponent));
    const addCartButton = productCart.query(By.css('.product__add-basket')).nativeElement as HTMLButtonElement;
    actions$
      .pipe(ofActionDispatched(CreateOrIncrementCartItem), take(1))
      .subscribe((action: CreateOrIncrementCartItem) => expect(action.productId).toBe(product.id));
    addCartButton.click();
  });
});
