import { NgxsDevtoolsOptions } from '@ngxs/devtools-plugin';

import { environment } from '@environment';

export const NGXS_STORE_DEVTOOLS_CONFIG: NgxsDevtoolsOptions = {
  name: 'Shopping Assessment',
  maxAge: 30,
  disabled: environment.production
}
