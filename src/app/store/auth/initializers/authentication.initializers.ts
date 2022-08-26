import { StateContext, Store } from '@ngxs/store';
import * as moment from 'moment/moment';

import { AuthConstants } from '@store/auth/enums/auth-constants.enum';
import { LocalStorageTokenModel } from '@store/auth/models/local-storage-token.model';
import { Logout, SetToken } from '@store/auth/state/auth.actions';

export function authenticationInitializer(store: Store) {
  return () => {
    const authToken = localStorage.getItem(AuthConstants.tokenStorageKey);

    if (authToken === undefined || authToken === null) {
      return;
    }

    const authTokenParsed = JSON.parse(authToken) as LocalStorageTokenModel;
    const secondsLeft = getTotalSecondsLeftFromToken(authTokenParsed);

    if (secondsLeft > 0) {
      store.dispatch(new SetToken(authTokenParsed.token));
      registerAuthenticationTimeout(store, secondsLeft)
    } else {
      store.dispatch(new Logout());
    }
  };
}

export const getTotalSecondsLeftFromToken = (token: LocalStorageTokenModel) => {
  const { expiresAt } = token;
  const expiresInMoment = moment.unix(expiresAt);
  return moment.duration(expiresInMoment.diff(moment())).asSeconds();
};

/**
 * @param store
 * @param lifeTime expiration time in seconds
 */
export const registerAuthenticationTimeout = (store: Store | StateContext<any>, lifeTime: number) => {
  setInterval(() => store.dispatch(new Logout()), lifeTime * 1000)
};
