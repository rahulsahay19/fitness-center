import { Subject } from 'rxjs';

import { Exercise } from './exercise.model';
import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  constructor(private db: AngularFirestore){}
  exerciseChanged = new Subject<Exercise>();
  exercisesChanged = new Subject<Exercise[]>();
  private availableExercises: Exercise[] = [
    { id: 'crunches', name: 'Crunches', duration: 30, calories: 8 },
    { id: 'touch-toes', name: 'Touch Toes', duration: 180, calories: 15 },
    { id: 'side-lunges', name: 'Side Lunges', duration: 120, calories: 18 },
    { id: 'burpees', name: 'Burpees', duration: 60, calories: 8 }
  ];
  private runningExercise: Exercise;
  private exercises: Exercise[] = [];

  fetchAvailableExercises() {
    this.db.collection('availableExercise')
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
    this.availableExercises = exercises;
    this.exercisesChanged.next([...this.availableExercises]); 
   });
  }

  startExercise(selectedId: string) {
    this.runningExercise = this.availableExercises.find(
      ex => ex.id === selectedId
    );
    this.exerciseChanged.next({ ...this.runningExercise });
  }

  completeExercise() {
        this.addDataToDatabase({
  // this.exercises.push({
      ...this.runningExercise,
      date: new Date(),
      state: 'completed'
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  cancelExercise(progress: number) {
    this.addDataToDatabase({
    //this.exercises.push({
      ...this.runningExercise,
      duration: this.runningExercise.duration * (progress / 100),
      calories: this.runningExercise.calories * (progress / 100),
      date: new Date(),
      state: 'cancelled'
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  getRunningExercise() {
    return { ...this.runningExercise };
  }

  getCompletedOrCancelledExercises() {
    return this.exercises.slice();
  }

  private addDataToDatabase(exercise: Exercise) {
    this.db.collection('finishedExercise').add(exercise);
  }
}
