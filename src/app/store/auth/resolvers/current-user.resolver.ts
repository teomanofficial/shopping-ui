import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { switchMap, take } from 'rxjs/operators';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { AuthState } from '@store/auth/state/auth.state';
import { GetCurrentUser } from '@store/auth/state/auth.actions';
import { CurrentUserModel } from '@store/auth/models/current-user.model';

@Injectable({ providedIn: 'root' })
export class CurrentUserResolver implements Resolve<CurrentUserModel> {
  @Select(AuthState.selectIsLoggedIn)
  isLoggedIn$: Observable<boolean>

  constructor(private readonly store: Store) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<CurrentUserModel> | Promise<CurrentUserModel> | CurrentUserModel {
    return this.isLoggedIn$.pipe(
      switchMap(isLoggedIn => isLoggedIn ? this.store.dispatch(new GetCurrentUser()) : EMPTY),
      take(1)
    )
  }
}
