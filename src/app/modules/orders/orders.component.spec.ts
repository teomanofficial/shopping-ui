import { ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersComponent } from './orders.component';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { PageTitleDirective } from '@shared/directives/page-title.directive';
import { PageActionsDirective } from '@shared/directives/page-actions.directive';
import { EntityDataContainerComponent } from '@shared/components/entity-data-container/entity-data-container.component';
import { NgxsModule, Store } from '@ngxs/store';
import { OrdersState } from '@store/orders/state/orders.state';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MdbModalModule } from 'mdb-angular-ui-kit/modal';
import { By } from '@angular/platform-browser';
import { OrderStateModel } from '@store/orders/models/order-state.model';
import { DataStateType } from '@core/store';
import { OrderStatus } from '@store/orders/enums/order-status.enum';
import { CurrencyPipe, DatePipe } from '@angular/common';

const ORDER_STATE: OrderStateModel = {
  data: [
    {
      id: '8a1fa3c0-8746-4cdd-bc61-ea1b17002636',
      orderItems: [],
      totalPrice: 240,
      code: 'PO12345',
      userId: '96f7ffc0-54ea-4aea-90b3-388ddf0a0d8d',
      status: OrderStatus.draft,
      createdAt: new Date().toISOString()
    },
    {
      id: '796292ac-ac19-4ac3-9223-136a58e81f8c',
      orderItems: [],
      totalPrice: 500,
      code: 'PO12346',
      userId: '96f7ffc0-54ea-4aea-90b3-388ddf0a0d8d',
      status: OrderStatus.draft,
      createdAt: new Date().toISOString()
    },
    {
      id: '3fccbcbc-2b5d-450c-beef-436a62dcae96',
      orderItems: [],
      totalPrice: 1200,
      code: 'PO12347',
      userId: '96f7ffc0-54ea-4aea-90b3-388ddf0a0d8d',
      status: OrderStatus.submitted,
      createdAt: new Date().toISOString()
    }
  ],
  dataState: DataStateType.loadEnd
}

describe('OrdersComponent', () => {
  let component: OrdersComponent;
  let fixture: ComponentFixture<OrdersComponent>;
  let store: Store;
  let currencyPipe: CurrencyPipe;
  let datePipe: DatePipe;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        OrdersComponent,
        PageHeaderComponent,
        PageTitleDirective,
        PageActionsDirective,
      ],
      providers: [CurrencyPipe, DatePipe],
      imports: [
        MdbModalModule,
        HttpClientTestingModule,
        NgxsModule.forRoot([OrdersState])
      ]
    })
      .overrideComponent(OrdersComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default }
      })
      .compileComponents();

    store = TestBed.inject(Store);
    currencyPipe = TestBed.inject(CurrencyPipe);
    datePipe = TestBed.inject(DatePipe);

    store.reset({ ...store.snapshot(), orders: ORDER_STATE });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have page title', () => {
    expect(fixture.debugElement.query(By.css('#order-page-title'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('#order-page-title')).nativeElement.textContent.trim()).toBe('Orders');
  });

  it('should show orders table includes name, price, date and status columns', () => {
    expect(fixture.debugElement.query(By.css('#orders-table'))).withContext('should have table').toBeTruthy();
    expect(fixture.debugElement.query(By.css('#orders-name'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('#orders-total-price'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('#orders-date'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('#orders-status'))).toBeTruthy();
  });

  it('should show orders from state', () => {
    const orders = ORDER_STATE.data;
    const table = fixture.debugElement.query(By.css('#orders-table'));
    const rows = table.queryAll(By.css('tbody > tr'));
    expect(rows.length).toBe(orders.length);

    rows.forEach((row, index) => {
      const orderStatus = orders[index].status === OrderStatus.draft ? 'Complete Order' : 'Submitted';
      expect(row.query(By.css('#order-name-' + index)).nativeElement.textContent.trim()).toBe(orders[index].code);
      expect(row.query(By.css('#order-total-price-' + index)).nativeElement.textContent.trim()).toBe(currencyPipe.transform(orders[index].totalPrice));
      expect(row.query(By.css('#order-date-' + index)).nativeElement.textContent.trim()).toBe(datePipe.transform(orders[index].createdAt, 'dd.MM.yyyy HH:mm'));
      expect(row.query(By.css('#order-status-' + index)).nativeElement.textContent.trim()).toBe(orderStatus);
    })
  });

});
