import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { ValidationErrorModel } from '@core/models/validation-error.model';

@Injectable({ providedIn: 'root' })
export class ValidationErrorsService {
  private readonly errors$: Subject<ValidationErrorModel[]> = new Subject();

  setValidationErrors(errors: ValidationErrorModel[]) {
    this.errors$.next(errors);
  }

  getValidationErrors() {
    return this.errors$.asObservable();
  }
}
