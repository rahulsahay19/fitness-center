import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Subscription, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
 
  constructor(private store: Store<fromRoot.State>, private authService: AuthService) { }

 @Output() sidenavToggle = new EventEmitter<void>();
 isAuth$:Observable<boolean>;
 authSubscription: Subscription;

  ngOnInit() {
  // this.authSubscription =  this.authService.authChange.subscribe(authStatus =>{
  //   this.isAuth= authStatus;
  //   });
  this.isAuth$ = this.store.select(fromRoot.getIsAuth);
  }

  onToggleSidenav(){
    this.sidenavToggle.emit();
  }

  onLogout(){
    this.authService.logout();
  }

}
