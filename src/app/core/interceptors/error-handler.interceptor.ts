import Swal from 'sweetalert2';
import { Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';

import { HttpErrorStatus } from '@core/enums/http-error-status.enum';
import { BadRequestResponseModel } from '@core/models/bad-request-response.model';
import { RfcTypes } from '@core/enums/rfc-types.enum';
import { ValidationErrorsService } from '@core/services/validation-errors.service';
import { ValidationErrorModel } from '@core/models/validation-error.model';
import { CustomHeaders } from '@core/enums/custom-headers.enum';

@Injectable({ providedIn: 'root' })
export class ErrorHandlerInterceptor implements HttpInterceptor {
  constructor(private readonly validationErrorService: ValidationErrorsService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
      .pipe(catchError(event => {
        if (event instanceof HttpErrorResponse) {
          if (event.status === HttpErrorStatus.userFriendlyError || event.status === HttpErrorStatus.unauthorizedError || event.status === HttpErrorStatus.notFoundError) {
            if (req.headers.has(CustomHeaders.skipGlobalErrorhandler)) return throwError(event)
            this.handleUserFriendError(event);
            return throwError(event);
          }

          if (event.status === HttpErrorStatus.unauthenticatedError) {
            this.handleAuthenticatedError(event);
            return throwError(event);
          }

          if (event.status === HttpErrorStatus.badRequestError && (event.error as BadRequestResponseModel).type === RfcTypes.badRequestType) {
            this.handleValidationError(event);
            return throwError(event);
          }

          if (event.status === HttpErrorStatus.serverError) {
            this.handleServerErrors();
            return throwError(event);
          }
        }

        return throwError(event);
      }));
  }

  private handleUserFriendError(event: HttpErrorResponse) {
    Swal.fire({
      icon: 'error',
      text: event.error.message,
      confirmButtonText: 'Close'
    });
  }

  private handleValidationError(event: HttpErrorResponse) {
    const messages = (event.error as BadRequestResponseModel).errors;
    const messagesNormalized: ValidationErrorModel[] = [];
    for (let key in messages) {
      messagesNormalized.push({ key, message: messages[key][0] });
    }

    this.validationErrorService.setValidationErrors(messagesNormalized);
  }

  private handleServerErrors() {
    Swal.fire({
      icon: 'error',
      text: 'Unexpected error occurred. Please contact with the support team!',
      confirmButtonText: 'Close'
    });
  }

  private handleAuthenticatedError(event: HttpErrorResponse) {
    Swal.fire({
      icon: 'error',
      text: 'You must be logged in order to proceed!',
      confirmButtonText: 'Close'
    });
  }
}
