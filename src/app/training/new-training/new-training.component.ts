import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model';
import { NgForm } from '@angular/forms';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromTraining from '../training.reducer';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit{


 @Output() trainingStart = new EventEmitter<void>();
 exercises$: Observable<Exercise[]>;
 exerciseSubscription: Subscription;
  constructor(private trainingService:TrainingService, private db: AngularFirestore, private store:Store<fromTraining.State>) { }

  ngOnInit() {
    this.exercises$ = this.store.select(fromTraining.getAvailableExercises);
    this.trainingService.fetchAvailableExercises();
}


  onStartTraining(form: NgForm){
    this.trainingService.startExercise(form.value.exercise);
  }

}
