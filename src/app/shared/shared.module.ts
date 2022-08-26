import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoginComponent } from '@shared/components/login/login.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { EntityDataContainerComponent } from './components/entity-data-container/entity-data-container.component';
import { PageHeaderComponent } from './components/page-header/page-header.component';
import { PageTitleDirective } from './directives/page-title.directive';
import { PageActionsDirective } from './directives/page-actions.directive';

@NgModule({
  declarations: [
    LoginComponent,
    ProductCardComponent,
    EntityDataContainerComponent,
    PageHeaderComponent,
    PageTitleDirective,
    PageActionsDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    LoginComponent,
    ReactiveFormsModule,
    ProductCardComponent,
    EntityDataContainerComponent,
    PageHeaderComponent,
    PageTitleDirective,
    PageActionsDirective,
  ]
})
export class SharedModule {
}
