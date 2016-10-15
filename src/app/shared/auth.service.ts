import { Injectable } from '@angular/core';
import { FirebaseAuthState, FirebaseAuth, AuthProviders, AngularFire } from 'angularfire2';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Rx';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {
  admin$: Subject<boolean>;

  private user: any = null;

  constructor(private af: AngularFire, private router: Router) {
    this.admin$ = <Subject<boolean>>new Subject();

    this.af.auth.subscribe(
      auth => {
        if(auth){
          /*
          this.user = af.database.object(`users_list/${auth.uid}`).subscribe(
            res => {
              this.user = res;
              this.admin$.next(this.user.role === 10);
              this.admin$.complete();
            },
            err => this.admin$.error(err)
          );
          */
          this.user = auth.uid;
          this.admin$.next(true);
          this.admin$.complete();
        }else{
          this.user = null;
          this.admin$.next(false);
          this.admin$.complete();
          this.router.navigate(['login']);
        }
      }
    );
  }

  /*doLogin(){
    this.admin$ = <Subject<boolean>>new Subject();
    this.af.auth.login();
  }*/

  admin() {
    return this.admin$;
  }

  signIn(): firebase.Promise<FirebaseAuthState> {
    return this.af.auth.login()
      .catch(error => console.log('ERROR @ AuthService#signIn() :', error));
  }

  signOut(): void {
    this.af.auth.logout();
  }


  /*
  private userId: string;

  constructor(private af: AngularFire) { }
  setUserId(userId) { this.userId = userId; }
  getAuthenticated(): Observable<any> { return this.af.auth; }
  */

  /*
  private authState: FirebaseAuthState = null;

  constructor(public auth$: FirebaseAuth) {
    auth$.subscribe((state: FirebaseAuthState) => {
      console.log("auth subscribe", state);
      this.authState = state;
    });
  }

  get authenticated(): boolean {
    return this.authState !== null;
  }

  get userId(): string {
    return this.authenticated ? this.authState.uid : '';
  }

  signIn(): firebase.Promise<FirebaseAuthState> {
    return this.auth$.login()
      .catch(error => console.log('ERROR @ AuthService#signIn() :', error));
  }

  signOut(): void {
    this.auth$.logout();
  }
  */
}
