import { Store } from '@ngxs/store';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { LoginRequestModel } from '@store/auth/models/login-request.model';
import { Login } from '@store/auth/state/auth.actions';
import { ValidationErrorsService } from '@core/services/validation-errors.service';
import { ValidationErrorModel } from '@core/models/validation-error.model';
import { HttpErrorStatus } from '@core/enums/http-error-status.enum';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginDialogComponent implements OnInit, OnDestroy {
  form: FormGroup;
  loginFailedError: string;
  validationErrors: ValidationErrorModel[] = [];
  actionLoading: boolean;

  private readonly destroyed$ = new Subject();

  constructor(
    private readonly store: Store,
    private readonly validationService: ValidationErrorsService,
    private readonly activeDialog: MdbModalRef<LoginDialogComponent>,
    private readonly cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.registerForm();
    this.registerValidationErrors();
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  onFormSubmit() {
    this.loginFailedError = null;
    this.validationErrors = [];

    if (this.form.invalid) {
      for (let control of Object.values(this.form.controls)) {
        control.markAsDirty();
        control.markAsTouched();
      }
      return;
    }

    this.actionLoading = true;
    const request = this.form.value as LoginRequestModel;
    this.store.dispatch(new Login(request))
      .pipe(finalize(() => {
        this.actionLoading = false;
        this.cdr.markForCheck();
      }))
      .subscribe(
        () => this.activeDialog.close(),
        (error: HttpErrorResponse) => {
          if (error.status === HttpErrorStatus.userFriendlyError) {
            this.loginFailedError = error.error.message;
            this.cdr.markForCheck();
          }
        }
      )
  }

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }

  private registerForm() {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required])
    })
  }

  onCancelButtonClick() {
    this.activeDialog.close();
  }

  private registerValidationErrors() {
    this.validationService.getValidationErrors()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(errors => {
        this.validationErrors = errors;
        this.cdr.markForCheck();
      });
  }
}
