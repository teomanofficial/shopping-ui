import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoginDialogComponent } from '@shared/components/login-dialog/login-dialog.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { EntityDataContainerComponent } from './components/entity-data-container/entity-data-container.component';
import { PageHeaderComponent } from './components/page-header/page-header.component';
import { PageTitleDirective } from './directives/page-title.directive';
import { PageActionsDirective } from './directives/page-actions.directive';
import { PreviewOrderDialogComponent } from './components/preview-order-dialog/preview-order-dialog.component';
import { OrderItemsListComponent } from './components/order-items-list/order-items-list.component';
import { CdkStepperModule } from '@angular/cdk/stepper';

@NgModule({
  declarations: [
    LoginDialogComponent,
    ProductCardComponent,
    EntityDataContainerComponent,
    PageHeaderComponent,
    PageTitleDirective,
    PageActionsDirective,
    PreviewOrderDialogComponent,
    OrderItemsListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CdkStepperModule,
  ],
  exports: [
    LoginDialogComponent,
    ReactiveFormsModule,
    ProductCardComponent,
    EntityDataContainerComponent,
    PageHeaderComponent,
    PageTitleDirective,
    PageActionsDirective,
    PreviewOrderDialogComponent,
    OrderItemsListComponent,
  ]
})
export class SharedModule {
}
