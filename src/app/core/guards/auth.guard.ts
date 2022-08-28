import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Select } from '@ngxs/store';

import { AuthState } from '@store/auth/state/auth.state';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  @Select(AuthState.selectIsLoggedIn)
  isLoggedIn$: Observable<boolean>

  constructor(private readonly router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    return this.isLoggedIn$
      .pipe(map(isLoggedIn => {
        if (isLoggedIn) return true;
        return this.router.createUrlTree(['/']);
      }));
  }
}
