import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model';
import { NgForm } from '@angular/forms';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {


 @Output() trainingStart = new EventEmitter<void>();
 exercises: Exercise[];
 exerciseSubscription: Subscription;
  constructor(private trainingService:TrainingService, private db: AngularFirestore) { }

  ngOnInit() {
   // this.exercises = this.trainingService.getAvailableExercises();
  this.exerciseSubscription = this.trainingService
                                  .exercisesChanged
                                  .subscribe(exercises => this.exercises = exercises);
   this.trainingService.fetchAvailableExercises();
}

ngOnDestroy(): void {
  this.exerciseSubscription.unsubscribe();
}

  onStartTraining(form: NgForm){
    this.trainingStart.emit(form.value.exercise);
  }

}
