import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CurrentUserResolver } from '@store/auth/resolvers/current-user.resolver';
import { BaseComponent } from '@shared/layout/base/base.component';
import { CartItemsResolver } from '@store/cart/resolvers/cart-items.resolver';
import { AuthGuard } from '@core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: BaseComponent,
    resolve: { currentUser: CurrentUserResolver, cart: CartItemsResolver },
    children: [
      { path: '', pathMatch: 'full', loadChildren: () => import('./modules/home/home.module').then(x => x.HomeModule) },
      {
        path: 'cart',
        canActivate: [AuthGuard],
        loadChildren: () => import('./modules/cart/cart.module').then(x => x.CartModule)
      },
      {
        path: 'orders',
        canActivate: [AuthGuard],
        loadChildren: () => import('./modules/orders/orders.module').then(x => x.OrdersModule)
      },
      {
        path: 'products',
        loadChildren: () => import('./modules/products/products.module').then(x => x.ProductsModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
