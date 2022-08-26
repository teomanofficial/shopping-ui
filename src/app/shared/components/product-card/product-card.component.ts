import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { ProductResponseModel } from '@store/products/models/product-response.model';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {
  @Input() product: ProductResponseModel;

  @Output() addCart: EventEmitter<string> = new EventEmitter<string>();

  constructor() {
  }

  ngOnInit(): void {
  }

  onAddBasketButtonClick() {
    this.addCart.emit(this.product.id);
  }
}
