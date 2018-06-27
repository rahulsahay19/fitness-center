import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
 
  constructor(private authService: AuthService) { }

 @Output() sidenavToggle = new EventEmitter<void>();
 isAuth: boolean = false;
 authSubscription: Subscription;

  ngOnInit() {
  this.authSubscription =  this.authService.authChange.subscribe(authStatus =>{
    this.isAuth= authStatus;
    });
  }

  // This clears the unused memory when component is dead.
  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  onToggleSidenav(){
    this.sidenavToggle.emit();
  }

  onLogout(){
    this.authService.logout();
  }

}
