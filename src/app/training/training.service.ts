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
  private fbSubs:Subscription[] = [];

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
    this.store.dispatch(new Training.SetAvailableTrainings(exercises));
   }, error =>{
     this.uiService.loadingStateChanged.next(false);
     this.uiService.showSnackbar('Fetching exercises failed, Please try again later!', null, 3000);
     this.exerciseChanged.next(null);
   }));
  }

  startExercise(selectedId: string) {
    this.store.dispatch(new Training.StartTraining(selectedId))
  }

  completeExercise() {
    this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(ex=>{
      this.addDataToDatabase({
            ...ex,
            date: new Date(),
            state: 'completed'
          });
          this.store.dispatch(new Training.StopTraining());
    });
       
  }

  cancelExercise(progress: number) {
    this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(ex=>{
      this.addDataToDatabase({
            ...ex,
            duration: ex.duration * (progress / 100),
            calories: ex.calories * (progress / 100),
            date: new Date(),
            state: 'cancelled'
          });
          this.store.dispatch(new Training.StopTraining());
    });
  }

  fetchCompletedOrCancelledExercises() {
   this.fbSubs.push(this.db.collection('finishedExercise')
    .valueChanges()
    .subscribe((exercises: Exercise[]) =>{
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
