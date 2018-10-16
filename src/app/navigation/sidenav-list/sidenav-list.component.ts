import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { AuthService } from "../../auth/auth.service";
import { Subscription, Observable } from "rxjs";
import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer';

@Component({
  selector: "app-sidenav-list",
  templateUrl: "./sidenav-list.component.html",
  styleUrls: ["./sidenav-list.component.css"]
})
export class SidenavListComponent implements OnInit {
 
  @Output() closeSidenav = new EventEmitter<void>();
  isAuth$:Observable<boolean>;
  authSubscription: Subscription;
  constructor(private authService: AuthService, private store: Store<fromRoot.State>) {}

  ngOnInit() {
    // this.authSubscription = this.authService.authChange.subscribe(authStatus =>{
    //   this.isAuth = authStatus;
    // });
    this.isAuth$ = this.store.select(fromRoot.getIsAuth);
  }

  onClose() {
    this.closeSidenav.emit();
  }

  onLogout() {
    this.onClose();
    this.authService.logout();
  }

 }
