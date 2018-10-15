import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UIService } from '../../shared/ui.service';
import { Subscription, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  isLoading$: Observable<boolean>;
  isLoading: boolean;
 // isLoading$: Subscription;
  private Subscription: Subscription;

  constructor(
    private authService: AuthService,
    private uiService: UIService,
    private store: Store<fromRoot.State>) {}

  ngOnInit() {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    // this.Subscription = this.store.subscribe((state)=>{
    //   this.isLoading = state.ui.isLoading;
    // });
   // this.store.subscribe(data=>console.log(data));
   //this.isLoading$ = this.store.pipe(map(state => state.ui.isLoading));
   //this.isLoading$ = this.store.select(fromApp.appReducer.name)
  //  this.isLoading$ = this.store.pipe(
  //     map((state)=>{
  //       const load:boolean = state.ui.isLoading;
  //     })
      
  //  )

   //this.isLoading$ = this.store.select('ui.isLoading');
   
   //const loading = this.isLoading$.pipe(map(state=>state.value));
   
 // this.isLoading$ = this.store.subscribe(state => state.ui.isLoading);
   console.log('isLoading Value:- ',this.isLoading);
    // this.loadingSubs = this.uiService.loadingStateChanged.subscribe(isLoading =>{
    //   this.isLoading = isLoading;
    // });
    this.loginForm = new FormGroup({
      email: new FormControl('', {
        validators: [Validators.required, Validators.email]
      }),
      password: new FormControl('', { validators: [Validators.required] })
    });
  }

  onSubmit() {
    this.authService.login({
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    });
  }

  // ngOnDestroy(): void {
  //   if (this.loadingSubs) {
  //     this.loadingSubs.unsubscribe();
  //   }
  // }
}
