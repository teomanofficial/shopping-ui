import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { ChangeDetectionStrategy } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Actions, NgxsModule, ofActionDispatched, Store } from '@ngxs/store';
import { AuthState } from '@store/auth/state/auth.state';
import { MdbModalModule } from 'mdb-angular-ui-kit/modal';
import { AuthStateModel } from '@store/auth/models/auth-state.model';
import { By } from '@angular/platform-browser';
import { Logout } from '@store/auth/state/auth.actions';
import { take } from 'rxjs/operators';

const AUTHENTICATED_AUTH_STATE: AuthStateModel = {
  isLoggedIn: true,
  token: 'token',
  user: { id: 'id', firstName: 'Test', lastName: 'Test', email: 'test@email.com' }
}

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let store: Store;
  let actions$: Actions;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [
        MdbModalModule,
        RouterTestingModule,
        HttpClientTestingModule,
        NgxsModule.forRoot([AuthState])
      ]
    })
      .overrideComponent(HeaderComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default }
      })
      .compileComponents();

    store = TestBed.inject(Store);
    actions$ = TestBed.inject(Actions);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show login button if user not authenticated', () => {
    store.reset({ ...store.snapshot(), auth: { isLoggedIn: false } as AuthStateModel })
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#login-button'))).toBeTruthy();
  });

  it('should hide orders menu if user not authenticated', () => {
    store.reset({ ...store.snapshot(), auth: { isLoggedIn: false } as AuthStateModel })
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#orders-menu'))).toBeFalsy();
  });

  it('should show orders menu if user authenticated', () => {
    store.reset({ ...store.snapshot(), auth: AUTHENTICATED_AUTH_STATE })
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#user-dropdown'))).toBeTruthy();
  });

  it('should show dropdown menu when user dropdown click', () => {
    store.reset({ ...store.snapshot(), auth: AUTHENTICATED_AUTH_STATE })
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#user-dropdown-button'))).toBeTruthy();
    const dropdownButton = fixture.debugElement.query(By.css('#user-dropdown-button')).nativeElement as HTMLButtonElement;
    dropdownButton.click();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#user-dropdown-menu'))).toBeTruthy();
  });

  it('should dispatch logout action when logout button click', () => {
    store.reset({ ...store.snapshot(), auth: AUTHENTICATED_AUTH_STATE })
    fixture.detectChanges();
    const dropdownButton = fixture.debugElement.query(By.css('#user-dropdown-button')).nativeElement as HTMLButtonElement;
    dropdownButton.click();
    fixture.detectChanges();
    actions$.pipe(ofActionDispatched(Logout), take(1)).subscribe(action => expect(action).toBeInstanceOf(Logout));
    const logoutButton = fixture.debugElement.query(By.css('#logout-button')).nativeElement as HTMLButtonElement;
    logoutButton.click();
    fixture.detectChanges();
  });
});
