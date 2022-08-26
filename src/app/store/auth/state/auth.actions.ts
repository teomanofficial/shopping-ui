import { LoginRequestModel } from '@store/auth/models/login-request.model';
import { CurrentUserModel } from '@store/auth/models/current-user.model';

export class Login {
  static readonly type = '[Auth] Login';

  constructor(public readonly request: LoginRequestModel) {
  }
}

export class Logout {
  static readonly type = '[Auth] Logout';
}

export class GetCurrentUser {
  static readonly type = '[Auth] Get Current User';
}

export class SetCurrentUser {
  static readonly type = '[Auth] Set Current User';

  constructor(public readonly user: CurrentUserModel) {
  }
}

export class SetToken {
  static readonly type = '[Auth] Set Token';

  constructor(public readonly token: string) {
  }
}
