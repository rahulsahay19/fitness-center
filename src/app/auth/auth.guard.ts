import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  CanLoad
} from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";
import { Route } from "@angular/compiler/src/core";

@Injectable({
  providedIn: "root"
})
export class AuthGuard implements CanActivate, CanLoad {
 
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    // if (this.authService.isAuth()) {
    //   return true;
    // } else {
    //   this.router.navigate(["/login"]);
    // }
    return true;
  }

  canLoad(route: Route) {
   if (this.authService.isAuth()) {
      return true;
    } else {
      this.router.navigate(["/login"]);
    }
  }
}
