import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { NGRX_STORE_CONFIG } from './config/ngx-store.config';
import { NGRX_STORE_DEVTOOLS_CONFIG } from './config/ngx-store-devtools.config';
import { PrependApiUrlInterceptor } from '@core/interceptors/prepend-api-url.interceptor';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
    StoreModule.forRoot(NGRX_STORE_CONFIG),
    EffectsModule.forRoot(),
    StoreDevtoolsModule.instrument(NGRX_STORE_DEVTOOLS_CONFIG),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, multi: true, useClass: PrependApiUrlInterceptor }
  ]
})
export class CoreModule {
}
