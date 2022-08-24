import { StoreDevtoolsOptions } from '@ngrx/store-devtools/src/config';

import { environment } from '@environment';

export const NGRX_STORE_DEVTOOLS_CONFIG: StoreDevtoolsOptions = {
  name: 'Shopping Assessment',
  maxAge: 30,
  logOnly: !environment.production
}
