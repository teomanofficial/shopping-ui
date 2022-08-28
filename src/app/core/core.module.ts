import { APP_INITIALIZER, NgModule } from '@angular/core';
import { NgxsModule, Store } from '@ngxs/store';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsSelectSnapshotModule } from '@ngxs-labs/select-snapshot';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { StateClass } from '@ngxs/store/internals';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';

import { NGXS_STORE_DEVTOOLS_CONFIG } from './config/ngxs-store-devtools.config';
import { PrependApiUrlInterceptor } from '@core/interceptors/prepend-api-url.interceptor';
import { AuthState } from '@store/auth/state/auth.state';
import { authenticationInitializer } from '@store/auth/initializers/authentication.initializers';
import { SetAuthorizationHeaderInterceptor } from '@core/interceptors/set-authorization-header.interceptor';
import { CartState } from '@store/cart/state/cart.state';
import { ErrorHandlerInterceptor } from '@core/interceptors/error-handler.interceptor';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
    NgxsModule.forRoot([AuthState, CartState] as StateClass[]),
    NgxsSelectSnapshotModule.forRoot(),
    NgxsRouterPluginModule.forRoot(),
    NgxsReduxDevtoolsPluginModule.forRoot(NGXS_STORE_DEVTOOLS_CONFIG),
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, multi: true, useClass: PrependApiUrlInterceptor },
    { provide: HTTP_INTERCEPTORS, multi: true, useClass: SetAuthorizationHeaderInterceptor },
    { provide: HTTP_INTERCEPTORS, multi: true, useClass: ErrorHandlerInterceptor },
    {
      provide: APP_INITIALIZER,
      useFactory: authenticationInitializer,
      deps: [Store],
      multi: true
    },
  ]
})
export class CoreModule {
}
