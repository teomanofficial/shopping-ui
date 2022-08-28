import { Directive } from '@angular/core';

@Directive({
  selector: 'app-page-header>[appPageTitle]'
})
export class PageTitleDirective {

  constructor() {
  }

}
