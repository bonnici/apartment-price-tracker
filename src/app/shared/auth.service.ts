import { Injectable } from '@angular/core';
import { FirebaseAuthState, FirebaseAuth } from 'angularfire2';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {
  private authState: FirebaseAuthState = null;

  constructor(public firebaseAuth: FirebaseAuth, private router: Router) {
    firebaseAuth.subscribe((state: FirebaseAuthState) => {
      this.authState = state;
    });
  }

  public get authenticated(): boolean {
    return this.authState !== null;
  }

  public get userId(): string {
    return this.authenticated ? this.authState.uid : '';
  }

  public signIn(): firebase.Promise<FirebaseAuthState> {
    return this.firebaseAuth.login()
      .then(() => this.router.navigate(['']))
      .catch(error => console.error('AuthService signIn error:', error));
  }

  public signOut(): void {
    this.firebaseAuth.logout();
  }
}
