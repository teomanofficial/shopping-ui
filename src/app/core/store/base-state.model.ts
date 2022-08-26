import { DataStateType } from './data-state-type.enum';

export interface EntityStateModel<TEntity> {
  data: TEntity[];
  dataState: DataStateType;
}
