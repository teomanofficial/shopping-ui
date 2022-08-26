import { Directive } from '@angular/core';

@Directive({
  selector: 'app-page-header>[appPageActions]'
})
export class PageActionsDirective {

  constructor() { }

}
