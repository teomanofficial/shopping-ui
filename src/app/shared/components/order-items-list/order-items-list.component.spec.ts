import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderItemsListComponent } from './order-items-list.component';
import { OrderItemResponseModel } from '@store/orders/models/order-item-response.model';
import { ChangeDetectionStrategy } from '@angular/core';
import { By } from '@angular/platform-browser';
import { NgxsModule } from '@ngxs/store';
import { CartState } from '@store/cart/state/cart.state';
import { OrdersState } from '@store/orders/state/orders.state';
import { StateFn } from '@ngxs/store/src/utils/compose';
import { HttpClientTestingModule } from '@angular/common/http/testing';

const ORDER_ITEMS: OrderItemResponseModel[] = [
  {
    orderId: '7f93c757-5a5d-4c65-b425-69ea13840bfa',
    productId: 'ed1921cb-9cae-428b-9116-d18583ada865',
    productName: 'Test 1',
    quantity: 1,
    price: 10
  },
  {
    orderId: '7f93c757-5a5d-4c65-b425-69ea13840bfa',
    productId: '7a010cb6-db04-4539-a047-19b85afdfcdc',
    productName: 'Test 2',
    quantity: 5,
    price: 10
  },
  {
    orderId: '7f93c757-5a5d-4c65-b425-69ea13840bfa',
    productId: 'adc216eb-4567-4b1a-b004-de4776cc261f',
    productName: 'Test 3',
    quantity: 10,
    price: 10
  },
];

describe('OrderItemsListComponent', () => {
  let component: OrderItemsListComponent;
  let fixture: ComponentFixture<OrderItemsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderItemsListComponent],
      imports: [
        NgxsModule.forRoot([CartState]),
        HttpClientTestingModule,
      ]
    })
      .overrideComponent(OrderItemsListComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default }
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderItemsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should list order items', () => {
    component.orderItems = ORDER_ITEMS;
    fixture.detectChanges();
    const listItems = fixture.debugElement.queryAll(By.css('#order-item-list-table > tbody > tr'));
    expect(listItems.length).toBe(ORDER_ITEMS.length);
  });

  it('should have increment and decrement buttons for each order item', () => {
    component.orderItems = ORDER_ITEMS;
    fixture.detectChanges();
    const listItems = fixture.debugElement.queryAll(By.css('#order-item-list-table > tbody > tr'));
    listItems.forEach((item, index) => {
      expect(item.query(By.css('#order-item-increment-' + index))).toBeTruthy();
      expect(item.query(By.css('#order-item-quantity-' + index))).toBeTruthy();
      expect(item.query(By.css('#order-item-decrement-' + index))).toBeTruthy();
    });
  });

  it('should have remove button for each item', () => {
    component.orderItems = ORDER_ITEMS;
    fixture.detectChanges();
    const listItems = fixture.debugElement.queryAll(By.css('#order-item-list-table > tbody > tr'));
    listItems.forEach((item, index) => {
      expect(item.query(By.css('#order-item-remove-' + index))).toBeTruthy();
    });
  });

  it('should disable decrement button if item quantity 1', () => {
    const [minQuantityOrderItem] = ORDER_ITEMS;
    component.orderItems = [minQuantityOrderItem];
    fixture.detectChanges();
    const item = fixture.debugElement.query(By.css('#order-item-list-table > tbody > tr'));
    expect(item.query(By.css('#order-item-decrement-0')).properties.disabled).toBeTruthy();
  });

  it('should disable increment button if item quantity equal to max limit (10)', () => {
    const [_, __, maxQuantityOrderItem] = ORDER_ITEMS;
    component.orderItems = [maxQuantityOrderItem];
    fixture.detectChanges();
    const item = fixture.debugElement.query(By.css('#order-item-list-table > tbody > tr'));
    expect(item.query(By.css('#order-item-increment-0')).properties.disabled).toBeTruthy();
  });
});
