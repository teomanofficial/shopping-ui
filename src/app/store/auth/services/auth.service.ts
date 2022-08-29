import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { LoginRequestModel } from '@store/auth/models/login-request.model';
import { LoginResponseModel } from '@store/auth/models/login-response.model';
import { CurrentUserModel } from '@store/auth/models/current-user.model';
import { CustomHeaders } from '@core/enums/custom-headers.enum';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private readonly http: HttpClient) {
  }

  login(request: LoginRequestModel) {
    return this.http.post<LoginResponseModel>('api/Auth/Login', request, {
      headers: { [CustomHeaders.skipGlobalErrorhandler]: 'true' }
    })
  }

  getCurrentUser() {
    return this.http.get<CurrentUserModel>('api/Auth/AuthenticatedUser', {
      headers: { [CustomHeaders.skipGlobalErrorhandler]: 'true' }
    })
  }
}
