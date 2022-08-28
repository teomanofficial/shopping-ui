import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCardComponent } from './product-card.component';
import { ProductResponseModel } from '@store/products/models/product-response.model';
import { By } from '@angular/platform-browser';
import { take } from 'rxjs/operators';

const PRODUCT: ProductResponseModel = { id: '609d348c-cb77-4713-bba9-e921cbce9519', price: 100, name: 'Test Product' }

describe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductCardComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
    component.product = PRODUCT;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have product title', () => {
    expect(fixture.debugElement.query(By.css('#product-title')).nativeElement.textContent.trim()).toBe(PRODUCT.name);
  });

  it('should have product price', () => {
    expect(fixture.debugElement.query(By.css('#product-price')).nativeElement.textContent.trim()).toBe('$100.00');
  });

  it('should should have available add to cart button', () => {
    expect(fixture.debugElement.query(By.css('#product-add-to-cart'))).toBeTruthy();
  });

  it('should emit product id when add to cart button clicked', () => {
    const button = fixture.debugElement.query(By.css('#product-add-to-cart')).nativeElement as HTMLButtonElement;
    component.addCart.pipe(take(1)).subscribe(id => expect(id).toBe(PRODUCT.id));
    button.click();
  });
});
