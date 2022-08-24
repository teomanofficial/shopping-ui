import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', loadChildren: () => import('./modules/home/home.module').then(x => x.HomeModule) },
  { path: 'orders', loadChildren: () => import('./modules/orders/orders.module').then(x => x.OrdersModule) },
  { path: 'products', loadChildren: () => import('./modules/products/products.module').then(x => x.ProductsModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
