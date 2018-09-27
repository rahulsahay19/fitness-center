import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-past-trainings',
  templateUrl: './past-trainings.component.html',
  styleUrls: ['./past-trainings.component.css']
})
export class PastTrainingsComponent implements OnInit, OnDestroy {

  displayedColumns = ['date', 'name', 'duration', 'calories', 'state'];
  dataSource = new MatTableDataSource<Exercise>();
  private exChangedSubscription: Subscription;

  constructor(private trainingService: TrainingService) {}

  ngOnInit() {
   // this.dataSource.data = this.trainingService.getCompletedOrCancelledExercises();
   this.exChangedSubscription = this.trainingService.finishedExercisesChanged.subscribe((exercises:Exercise[])=>{
     this.dataSource.data = exercises;
   });
   
   // It simply emit events wheneevr value change
   this.trainingService.fetchCompletedOrCancelledExercises();
  }

  ngOnDestroy(): void {
   this.exChangedSubscription.unsubscribe();
  }

}
