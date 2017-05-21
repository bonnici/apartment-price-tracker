import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthService {
  public authState: Observable<firebase.User>;
  public userId: string = null;

  constructor(public firebaseAuth: AngularFireAuth, private router: Router) {
    this.authState = firebaseAuth.authState;
    this.authState.subscribe(user => this.userId = user ? user.uid : null);
  }

  public get authenticated(): boolean {
    return this.userId !== null;
  }

  public signIn(): firebase.Promise<firebase.User> {
    return this.firebaseAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then(() => this.router.navigate(['']))
      .catch(error => console.error('AuthService signIn error:', error));
  }

  public signOut(): void {
    this.firebaseAuth.auth.signOut();
  }
}
