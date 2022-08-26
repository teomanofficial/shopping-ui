import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginRequestModel } from '@store/auth/models/login-request.model';
import { Store } from '@ngxs/store';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { Login } from '@store/auth/state/auth.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup;

  constructor(
    private readonly store: Store,
    private readonly activeDialog: MdbModalRef<LoginComponent>
  ) {
  }

  ngOnInit(): void {
    this.registerForm();
  }

  private registerForm() {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required])
    })
  }

  onFormSubmit() {
    const request = this.form.value as LoginRequestModel;
    this.store.dispatch(new Login(request))
      .subscribe(() => this.activeDialog.close())
  }
}
