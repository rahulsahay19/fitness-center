import { Subject } from 'rxjs';

import { Exercise } from './exercise.model';
import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { UIService } from '../shared/ui.service';
import * as fromTraining from './training.reducer';
import * as Training from './training.actions';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  constructor(private db: AngularFirestore, private uiService: UIService, private store: Store<fromTraining.TrainingState>){}
  exerciseChanged = new Subject<Exercise>();
  exercisesChanged = new Subject<Exercise[]>();
  finishedExercisesChanged = new Subject<Exercise[]>();
  private availableExercises: Exercise[] = [];
  private runningExercise: Exercise;
  private fbSubs:Subscription[] = [];
  //private finishedExercises: Exercise[] = [];

  fetchAvailableExercises() {
   this.fbSubs.push(this.db.collection('availableExercise')
   .snapshotChanges()
   .pipe(
   map(docArray =>{
     return docArray.map(doc =>{
        return {
          id: doc.payload.doc.id,
          ...doc.payload.doc.data() //using the spread opeartor to access the other data as object and it will out of the object and add the same in existing object
          
        } as Exercise ;
      });
   })).subscribe((exercises:Exercise[]) =>{
    // this.availableExercises = exercises;
    // this.exercisesChanged.next([...this.availableExercises]); 
    this.store.dispatch(new Training.SetAvailableTrainings(exercises));
   }, error =>{
     this.uiService.loadingStateChanged.next(false);
     this.uiService.showSnackbar('Fetching exercises failed, Please try again later!', null, 3000);
     this.exerciseChanged.next(null);
   }));
  }

  startExercise(selectedId: string) {
   // this.db.doc('availableExercises/'+ selectedId).update({lastSelected: new Date()})
    // this.runningExercise = this.availableExercises.find(
    //   ex => ex.id === selectedId
    // );
    // this.exerciseChanged.next({ ...this.runningExercise });
    this.store.dispatch(new Training.StartTraining(selectedId))
  }

  completeExercise() {
    this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(ex=>{
      this.addDataToDatabase({
        // this.exercises.push({
            ...ex,
            date: new Date(),
            state: 'completed'
          });
          // this.runningExercise = null;
          // this.exerciseChanged.next(null);
          this.store.dispatch(new Training.StopTraining());
    });
       
  }

  cancelExercise(progress: number) {
    this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(ex=>{
      this.addDataToDatabase({
        // this.exercises.push({
            ...ex,
            duration: ex.duration * (progress / 100),
            calories: ex.calories * (progress / 100),
            date: new Date(),
            state: 'cancelled'
          });
          // this.runningExercise = null;
          // this.exerciseChanged.next(null);
          this.store.dispatch(new Training.StopTraining());
    });
  }

  // getRunningExercise() {
  //   return { ...this.runningExercise };
  // }

  fetchCompletedOrCancelledExercises() {
   this.fbSubs.push(this.db.collection('finishedExercise')
    .valueChanges()
    .subscribe((exercises: Exercise[]) =>{
     // this.finishedExercises = exercises;
   //  this.finishedExercisesChanged.next(exercises);
    this.store.dispatch(new Training.SetFinishedTrainings(exercises));
    }));
  }

  cancelSubscription(){
    this.fbSubs.forEach(sub => sub.unsubscribe());
  }

  private addDataToDatabase(exercise: Exercise) {
    this.db.collection('finishedExercise').add(exercise);
  }
}
