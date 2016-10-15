import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { FirebaseAuth, FirebaseAuthState, AngularFire } from 'angularfire2';
import { AuthService } from './auth.service';
//import { Observable } from 'rxjs/Observable';
import { Observable } from 'rxjs/Rx';
/*
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
*/

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    this.authService.admin().subscribe(
      res => {
        console.log('auth guard subscribe', res);
        // Navigate to the login page
        if(!res) {
          this.router.navigate(['/login']);
        }
      },
      err => console.log(err),
      () => {
        console.log('auth guard can activate complete')
      }
    );

    return this.authService.admin();
  }

  /*
  constructor(private auth: AuthService, private router: Router) {}

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|boolean {
    console.log("this.auth.auth$", this.auth.authenticated, this.auth.auth$);
    return this.auth.auth$
      .take(1)
      .map(authState => !!authState)
      .do(authenticated => {
        if (!authenticated) {
          this.router.navigate(['/login']);
        }
      });
  }
  */

  /*
  constructor(private router: Router, private authService: AuthService) { }

  canActivate(): Observable<boolean> | boolean {
    // here check if this is first time call. If not return
    // simple boolean based on user object from authService
    // otherwise:

    return this.authService.getAuthenticated.map(user => {
      this.authService.setUserId(user);
      return user ? true : false;
    })

  }
  */

  /*
  constructor(private af: AngularFire, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.af.auth.map((auth) => {
      console.log("auth map", auth);
      if (auth == null) {
        this.router.navigate(['/login']);
        return false;
      } else {
        return true;
      }
    }).first()
  }
  */
}
