import { EntityStateModel } from './base-state.model';
import { DataStateType } from './data-state-type.enum';

export function createInitialEntityState<TEntity, TState extends EntityStateModel<TEntity>>(defaults: Omit<TState, 'dataState'>): TState {
  return { dataState: DataStateType.notInitialized, ...defaults } as TState;
}
