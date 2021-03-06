import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  CanLoad
} from "@angular/router";
import { Observable } from "rxjs";
import { Route } from "@angular/compiler/src/core";
import { Store } from '@ngrx/store';
import * as fromRoot from '../app.reducer';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: "root"
})
export class AuthGuard implements CanActivate, CanLoad {
 
  constructor(private store: Store<fromRoot.State>, private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.store.select(fromRoot.getIsAuth).pipe(take(1));
  }

  canLoad(route: Route) {
     return this.store.select(fromRoot.getIsAuth).pipe(take(1));
  }
}
