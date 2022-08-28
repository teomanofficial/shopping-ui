import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ChangeDetectionStrategy } from '@angular/core';
import { NgxsModule } from '@ngxs/store';

import { LoginDialogComponent } from './login-dialog.component';
import { CartModule } from '../../../modules/cart/cart.module';
import { CartState } from '@store/cart/state/cart.state';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MdbModalModule, MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { ReactiveFormsModule } from '@angular/forms';

export class MockModalService {
}

describe('LoginComponent', () => {
  let component: LoginDialogComponent;
  let fixture: ComponentFixture<LoginDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginDialogComponent],
      providers: [{ provide: MdbModalRef, useClass: MockModalService }],
      imports: [
        NgxsModule.forRoot([CartState]),
        HttpClientTestingModule,
        MdbModalModule,
        ReactiveFormsModule,
      ]
    })
      .overrideComponent(LoginDialogComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default }
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have email and password controls', () => {
    expect(fixture.debugElement.query(By.css('#email'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('#password'))).toBeTruthy();
  });

  it('should have available submit button', () => {
    const submitButton = fixture.debugElement.query(By.css('#login-button'));
    expect(submitButton).toBeTruthy();
    expect(submitButton.properties.disabled).toBeFalsy();
  });

  it('should show validation errors if empty form submitted', () => {
    const submitButton = fixture.debugElement.query(By.css('#login-button'));
    submitButton.nativeElement.click();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.validation-error'))).toBeTruthy();
  });

  it('should show error when login failed', () => {
    component.loginFailedError = 'Invalid credentials';
    fixture.detectChanges();
    const loginFailedAlert = fixture.debugElement.query(By.css('#login-failed-alert'));
    expect(loginFailedAlert).toBeTruthy();
    expect(loginFailedAlert.nativeElement.textContent.trim()).toBe(component.loginFailedError);
  });

  it('should show api validation errors if any', () => {
    const [validationError] = component.validationErrors = [{
      key: 'email',
      message: 'Email field must be at least 3 characters'
    }];
    fixture.detectChanges();
    const validationAlert = fixture.debugElement.query(By.css('#login-validation-errors'));
    expect(validationAlert).toBeTruthy();
    const validationErrorItem = fixture.debugElement.query(By.css('#login-validation-errors > ul > li'));
    expect(validationErrorItem.nativeElement.textContent.trim()).toBe(validationError.message);
  });
});
