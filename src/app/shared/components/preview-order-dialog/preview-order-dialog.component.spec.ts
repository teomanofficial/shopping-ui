import { By } from '@angular/platform-browser';
import { ChangeDetectionStrategy } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { take } from 'rxjs/operators';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewOrderDialogComponent } from './preview-order-dialog.component';
import { OrderResponseModel } from '@store/orders/models/order-response.model';
import { OrderStatus } from '@store/orders/enums/order-status.enum';
import { Actions, NgxsModule, ofActionDispatched } from '@ngxs/store';
import { OrdersState } from '@store/orders/state/orders.state';
import { CompleteOrder } from '@store/orders/state/orders.actions';
import { HttpClientTestingModule } from '@angular/common/http/testing';

const ORDER: OrderResponseModel = {
  id: '69b52009-af80-4444-af15-d9e1b0d4bf2c',
  orderItems: [],
  totalPrice: 100,
  status: OrderStatus.draft,
  code: 'PO123456',
  createdAt: new Date().toISOString(),
  userId: 'c5b821c4-7b9b-4f2e-a20a-5d58a827cb02'
};

export class MdbModalRefMock {
}

describe('PreviewOrderDialogComponent', () => {
  let component: PreviewOrderDialogComponent;
  let fixture: ComponentFixture<PreviewOrderDialogComponent>;
  let actions$: Actions;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PreviewOrderDialogComponent],
      providers: [{ provide: MdbModalRef, useClass: MdbModalRefMock }],
      imports: [
        NgxsModule.forRoot([OrdersState]),
        HttpClientTestingModule
      ]
    })
      .overrideComponent(PreviewOrderDialogComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default }
      })
      .compileComponents();
    actions$ = TestBed.inject(Actions)
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewOrderDialogComponent);
    component = fixture.componentInstance;
    component.order = ORDER;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have page title', () => {
    component.order = ORDER;
    component.step = 'details';
    fixture.detectChanges();
    const title = fixture.debugElement.query(By.css('#preview-order-title'));
    expect(title).toBeTruthy();
    expect(title.nativeElement.textContent.trim()).toBe('Preview Order Details');
  });

  it('should have show order details when step is details', () => {
    component.order = ORDER;
    component.step = 'details';
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#preview-order-details-table'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('#preview-order-details-order-code')).nativeElement.textContent.trim()).toBe(ORDER.code);
    expect(fixture.debugElement.query(By.css('#preview-order-details-total-price')).nativeElement.textContent.trim()).toBe('$100.00');
    expect(fixture.debugElement.query(By.css('#preview-order-details-number-of-products')).nativeElement.textContent.trim()).toBe(ORDER.orderItems.length.toString());
  });

  it('should have continue button when step is details', () => {
    component.step = 'details';
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#preview-order-continue-button'))).toBeTruthy();
  });

  it('should navigate items step when click continue button', () => {
    component.step = 'details';
    fixture.detectChanges();
    const continueButton = fixture.debugElement.query(By.css('#preview-order-continue-button'));
    continueButton.nativeElement.click();
    fixture.detectChanges();
    expect(component.step).toBe('items')
  });

  it('should have previous button when step is items', () => {
    component.step = 'items';
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#preview-order-previous-button'))).toBeTruthy();
  });

  it('should navigate details step when click previous button', () => {
    component.step = 'items';
    fixture.detectChanges();
    const previousButton = fixture.debugElement.query(By.css('#preview-order-previous-button'));
    previousButton.nativeElement.click();
    fixture.detectChanges();
    expect(component.step).toBe('details')
  });

  it('should show order items when step is items', () => {
    component.step = 'items';
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('app-order-items-list'))).toBeTruthy();
  });

  it('should have complete order button when step is items', () => {
    component.step = 'items';
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#preview-order-complete-order-button'))).toBeTruthy();
  });

  it('should dispatch complete order action when complete order button click', () => {
    component.step = 'items';
    fixture.detectChanges();
    const completeOrderButton = fixture.debugElement.query(By.css('#preview-order-complete-order-button'));
    actions$.pipe(ofActionDispatched(CompleteOrder), take(1))
      .subscribe(action => expect(action).toBeTruthy());
    completeOrderButton.nativeElement.click();
  });
});
