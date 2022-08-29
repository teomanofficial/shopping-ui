import { ChangeDetectionStrategy } from '@angular/core';
import { Actions, NgxsModule, ofActionDispatched, ofActionSuccessful, Store } from '@ngxs/store';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartComponent } from './cart.component';
import { CartState } from '@store/cart/state/cart.state';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MdbModalModule } from 'mdb-angular-ui-kit/modal';
import { By } from '@angular/platform-browser';
import { CartStateModel } from '@store/cart/models/cart-state.model';
import { DataStateType } from '@core/store';
import { CurrencyPipe } from '@angular/common';
import { CreateOrder } from '@store/orders/state/orders.actions';
import { take } from 'rxjs/operators';
import { ClearCart } from '@store/cart/state/cart.actions';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { EntityDataContainerComponent } from '@shared/components/entity-data-container/entity-data-container.component';
import { PageTitleDirective } from '@shared/directives/page-title.directive';
import { PageActionsDirective } from '@shared/directives/page-actions.directive';

const CART_STATE: CartStateModel = {
  data: [
    {
      productId: 'bb41420f-7ce6-4aa9-802b-fcdf8e60fe0f',
      userId: '8978a9ff-2a03-4c57-9ce5-d41d58c1f727',
      quantity: 5,
      product: {
        id: 'bb41420f-7ce6-4aa9-802b-fcdf8e60fe0f', name: 'Test', price: 100
      }
    },
    {
      productId: '5c724736-7697-45f6-a9c3-cdc6b267db9b',
      userId: '8978a9ff-2a03-4c57-9ce5-d41d58c1f727',
      quantity: 5,
      product: {
        id: '5c724736-7697-45f6-a9c3-cdc6b267db9b', name: 'Test', price: 100
      }
    },
  ],
  dataState: DataStateType.loadEnd
}

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let store: Store;
  let actions$: Actions;
  let currencyPipe: CurrencyPipe;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CartComponent, PageHeaderComponent, PageTitleDirective, PageActionsDirective, EntityDataContainerComponent],
      providers: [CurrencyPipe],
      imports: [
        MdbModalModule,
        HttpClientTestingModule,
        NgxsModule.forRoot([CartState]),
      ]
    })
      .overrideComponent(CartComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default }
      })
      .compileComponents();

    store = TestBed.inject(Store);
    currencyPipe = TestBed.inject(CurrencyPipe);
    actions$ = TestBed.inject(Actions);

    store.reset({
      ...store.snapshot(),
      cart: CART_STATE
    });

  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have page header', () => {
    expect(fixture.debugElement.query(By.css('#cart-page-title'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('#cart-page-title')).nativeElement.textContent).toBe('Shopping Cart')
  });

  it('should have cart items table with product name and price', () => {
    expect(fixture.debugElement.query(By.css('#cart-items-table'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('#cart-items-table-product-name'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('#cart-items-table-product-price'))).toBeTruthy();
  });

  it('should show cart items on the table', () => {
    const items = CART_STATE.data;
    const rows = fixture.debugElement.queryAll(By.css('#cart-items-table > tbody > tr'));
    expect(rows.length).toBe(CART_STATE.data.length);
    rows.forEach((row, index) => {
      const { quantity, product } = items[index];
      const price = currencyPipe.transform(quantity * product.price);
      expect(row.query(By.css('#cart-items-row-product-name-' + index)).nativeElement.textContent.trim()).toBe(product.name);
      expect(row.query(By.css('#cart-items-row-price-' + index)).nativeElement.textContent.trim()).toBe(price);
    });
  });

  it('should select all cart items at the beginning', () => {
    const rows = fixture.debugElement.queryAll(By.css('#cart-items-table > tbody > tr'));
    for (let row of rows) {
      const checkbox = row.query(By.css('input[type="checkbox"]'));
      expect(checkbox.properties.checked).toBeTruthy();
    }
  });

  it('should have total price', () => {
    const totalPrice = CART_STATE.data.reduce((t, i) => t + i.quantity * i.product.price, 0);
    const totalElement = fixture.debugElement.query(By.css('#cart-items-total-price'));
    expect(totalElement.nativeElement.textContent.trim()).toBe(currencyPipe.transform(totalPrice));
  });

  it('should have available create order button', () => {
    expect(fixture.debugElement.query(By.css('#cart-create-order'))).toBeTruthy();
  });

  it('should clear cart items from store when clear items button click', () => {
    const clearCartItems = fixture.debugElement.query(By.css('#cart-clear-items')).nativeElement as HTMLButtonElement;
    actions$.pipe(ofActionDispatched(ClearCart), take(1))
      .subscribe(action => expect(action).toBeInstanceOf(ClearCart));
    actions$.pipe(ofActionSuccessful(ClearCart), take(1))
      .subscribe(() => {
        const cartItems = store.selectSnapshot(CartState.selectData);
        expect(cartItems.length).toBe(0);
      });
    clearCartItems.click();
    fixture.detectChanges();
  });

  it('should dispatch create order action on create order button click', () => {
    const createOrderButton = fixture.debugElement.query(By.css('#cart-create-order')).nativeElement as HTMLButtonElement;
    actions$.pipe(ofActionDispatched(CreateOrder), take(1)).subscribe(action => expect(action).toBeInstanceOf(CreateOrder));
    createOrderButton.click();
    fixture.detectChanges();
  });
});
