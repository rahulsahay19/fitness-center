import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UIService } from '../../shared/ui.service';
import { Subscription, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from '../../app.reducer';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  isLoading$: Observable<boolean>;
 // isLoading$: Subscription;
  private loadingSubs: Subscription;

  constructor(
    private authService: AuthService,
    private uiService: UIService,
    private store: Store<{ui: fromApp.State}>) {}

  ngOnInit() {
   // this.store.subscribe(data=>console.log(data));
   this.isLoading$ = this.store.pipe(map(state => state.ui.isLoading));
   //const loading = this.isLoading$.pipe(map(state=>state.value));
   
 // this.isLoading$ = this.store.subscribe(state => state.ui.isLoading);
   console.log('isLoading Value:- ',this.isLoading$);
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
