import { Component, OnInit } from '@angular/core';
import { MdbModalService } from 'mdb-angular-ui-kit/modal';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';

import { AuthState } from '@store/auth/state/auth.state';
import { LoginDialogComponent } from '@shared/components/login-dialog/login-dialog.component';
import { CurrentUserModel } from '@store/auth/models/current-user.model';
import { Logout } from '@store/auth/state/auth.actions';
import { CartState } from '@store/cart/state/cart.state';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Select(AuthState.selectIsLoggedIn)
  isLoggedIn$: Observable<boolean>;

  @Select(AuthState.selectUser)
  user$: Observable<CurrentUserModel>;

  @Select(CartState.selectCartItemCount)
  cartItemsCount$: Observable<number>;

  constructor(
    private readonly store: Store,
    private readonly dialogService: MdbModalService
  ) {
  }

  ngOnInit(): void {
  }

  onLoginButtonClick() {
    this.dialogService.open(LoginDialogComponent, { modalClass: 'cascading-modal' })
  }

  onLogoutClick() {
    this.store.dispatch(new Logout());
  }
}
