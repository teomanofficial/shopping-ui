import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ContentComponent } from './content/content.component';
import { MdbDropdownModule } from 'mdb-angular-ui-kit/dropdown';
import { BaseComponent } from './base/base.component';


@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    ContentComponent,
    BaseComponent
  ],
    imports: [
        CommonModule,
        RouterModule,
        MdbDropdownModule
    ],
  exports: [
    HeaderComponent,
    FooterComponent,
    ContentComponent,
    BaseComponent
  ]
})
export class LayoutModule { }
