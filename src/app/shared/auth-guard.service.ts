import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {}

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|boolean {
    return this.auth.firebaseAuth
      .take(1)
      .map(authState => !!authState)
      .do(authenticated => {
        if (!authenticated) {
          this.router.navigate(['/login']);
        }
      });
  }
}
