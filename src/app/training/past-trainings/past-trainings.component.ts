import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromTraining from '../training.reducer';

@Component({
  selector: 'app-past-trainings',
  templateUrl: './past-trainings.component.html',
  styleUrls: ['./past-trainings.component.css']
})
export class PastTrainingsComponent implements OnInit {

  displayedColumns = ['date', 'name', 'duration', 'calories', 'state'];
  dataSource = new MatTableDataSource<Exercise>();
  private exChangedSubscription: Subscription;

  constructor(private trainingService: TrainingService, private store: Store<fromTraining.State>) {}

  ngOnInit() {
   // this.dataSource.data = this.trainingService.getCompletedOrCancelledExercises();
  //  this.exChangedSubscription = this.trainingService.finishedExercisesChanged.subscribe((exercises:Exercise[])=>{
  //    this.dataSource.data = exercises;
  //  });
   this.store.select(fromTraining.getFinishedExercises).subscribe(
     (exercises: Exercise[]) =>{
       this.dataSource.data = exercises;
     }
   )
   // It simply emit events wheneevr value change
   this.trainingService.fetchCompletedOrCancelledExercises();
  }

  // ngOnDestroy(): void {
  //   if(this.exChangedSubscription){
  //     this.exChangedSubscription.unsubscribe();
  //   }
  // }

}
