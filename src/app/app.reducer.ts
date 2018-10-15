import * as fromUi from './shared/ui.reducer';
import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';

export interface State {
    ui: fromUi.State;
}

//Map of all the reducers
export const reducers : ActionReducerMap<State> = {
    //mapped reducer or grouped reducer
    ui: fromUi.uiReducer
};

// selectors are helper functions which makes easy for us to pull info from our state.
export const getUiState = createFeatureSelector<fromUi.State>('ui');
// this utility function is to fetch the loading state
export const getIsLoading = createSelector(getUiState, fromUi.getIsLoading);
