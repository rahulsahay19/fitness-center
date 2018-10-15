import { Injectable } from "@angular/core";
import { User } from "./user.model";
import { AuthData } from "./auth-data.model";
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import { AngularFireAuth } from "angularfire2/auth";
import { TrainingService } from "../training/training.service";
import { MatSnackBar } from "@angular/material";
import { UIService } from "../shared/ui.service";
import { Store } from "@ngrx/store";
import * as fromApp from '../app.reducer';

@Injectable({
  providedIn: "root"
})
export class AuthService {
  authChange = new Subject<boolean>();
  // private user: User;
  private isAuthenticated = false;

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private trainingService: TrainingService,
    private uiService: UIService,
    private store: Store<{ui: fromApp.State}>
  ) {}

  initAuthListener() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.isAuthenticated = true;
        this.authChange.next(true);
        this.router.navigate(["/training"]);
      } else {
        this.trainingService.cancelSubscription();
        this.authChange.next(false);
        this.router.navigate(["/login"]);
        this.isAuthenticated = false;
      }
    });
  }

  registerUser(authData: AuthData) {
    //   this.user = {
    //       email: authData.email,
    //       userId: Math.round(Math.random()*10000).toString()
    //   };
    
    //this.uiService.loadingStateChanged.next(true);
    //above got replaced by reducer
    this.store.dispatch({type: 'START_LOADING'})
    this.afAuth.auth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then(result => {
      //  this.uiService.loadingStateChanged.next(false);
      this.store.dispatch({type: 'STOP_LOADING'})
        console.log(result);
    })
      .catch(error => {
       // this.uiService.loadingStateChanged.next(false);
       this.store.dispatch({type: 'STOP_LOADING'})
        this.uiService.showSnackbar(error.message,null, 3000);
      });
  }

  login(authData: AuthData) {
    //   this.user = {
    //       email: authData.email,
    //       userId: Math.round(Math.random()*10000).toString()
    //   };
  //  this.uiService.loadingStateChanged.next(true);
  this.store.dispatch({type: 'START_LOADING'})
    this.afAuth.auth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then(result => {
        console.log(result);
       // this.uiService.loadingStateChanged.next(false);
       this.store.dispatch({type: 'STOP_LOADING'})
    })
      .catch(error => {
       // this.uiService.loadingStateChanged.next(false);
       this.store.dispatch({type: 'STOP_LOADING'})
        this.uiService.showSnackbar(error.message,null, 3000);
      });
  }

  logout() {
    this.afAuth.auth.signOut();
 }

  //   getUser() {
  //       return {...this.user};
  //   }

  isAuth() {
    return this.isAuthenticated;
  }

  }
