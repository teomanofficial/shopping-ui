import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';

import { AuthState } from '@store/auth/state/auth.state';

@Injectable({ providedIn: 'root' })
export class SetAuthorizationHeaderInterceptor implements HttpInterceptor {
  constructor(private readonly store: Store) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { isLoggedIn, token } = this.store.selectSnapshot(AuthState.selectState)
    return next.handle(req.clone({
      headers: isLoggedIn
        ? req.headers.set('Authorization', `Bearer ${token}`)
        : req.headers
    }))
  }
}
