import { Component, OnInit } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { Http } from '@angular/http';
import { AuthService } from './shared/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public title = 'app works!';
  public response: any;

  constructor(public af: AngularFire, public authService: AuthService, private http: Http) {}

  public ngOnInit() {
    /*this.http.get('https://services.realestate.com.au/services/listings/419534970')
      .subscribe(
        (response) => this.response = response.json(),
        (err) => this.response = { err: err });*/
  }

  public signOut() {
    this.authService.signOut();
  }
}
