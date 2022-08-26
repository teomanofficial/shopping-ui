import { CurrentUserModel } from '@store/auth/models/current-user.model';

export interface AuthStateModel {
  isLoggedIn: boolean;
  token: string;
  user: CurrentUserModel;
}
