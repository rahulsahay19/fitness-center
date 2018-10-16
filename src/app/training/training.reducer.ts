import { Action, createFeatureSelector, createSelector } from '@ngrx/store';
import { Exercise } from './exercise.model';
import * as fromRoot from '../app.reducer';
import { TrainingActions, SET_AVAILABLE_TRAININGS, SET_FINISHED_TRAININGS, START_TRAINING, STOP_TRAINING } from './training.actions';

export interface TrainingState {
    availableExercises: Exercise[];
    finishedExercises: Exercise[];
    activeTraining: Exercise;
}

//This is for lazily loading modules. Merge will be taken care by ngrx.
//Therefore, this is our new global state after our module has lazily loaded
export interface State extends fromRoot.State {
    training: TrainingState;
}

const initialState: TrainingState = {
    availableExercises: [],
    finishedExercises: [],
    activeTraining: null
}

export function trainingReducer(state = initialState, action: TrainingActions ){
    switch(action.type){
        case SET_AVAILABLE_TRAININGS:
            return {
                //this will pull out all the states and store them in new object
                ...state,
                availableExercises: action.payload
            }
        case SET_FINISHED_TRAININGS: 
            return {
                ...state,
                finishedExercises: action.payload
            }
        case START_TRAINING:
            return {
                ...state,
                //Finding one object and storing the same in active training
                activeTraining: { ...state.availableExercises.find(ex => ex.id === action.payload)}
            }
        case STOP_TRAINING:
            return {
                ...state,
                activeTraining: null
            }
        default: {
            return state;
        }
    }
}

//This gives access to the entire state slice
export const getTrainingState = createFeatureSelector<TrainingState>('training');

//Then, this arrow function takes the state slice and picks the available exercises from it
export const getAvailableExercises = createSelector(getTrainingState, (state:TrainingState) => state.availableExercises);
export const getFinishedExercises = createSelector(getTrainingState, (state:TrainingState) => state.finishedExercises);
export const getActiveTraining = createSelector(getTrainingState, (state:TrainingState) => state.activeTraining);
export const getIsTraining = createSelector(getTrainingState, (state:TrainingState) => state.activeTraining != null);