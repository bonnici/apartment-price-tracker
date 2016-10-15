import { Component, OnInit } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { Http } from '@angular/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public title = 'app works!';
  public response: any;

  constructor(public af: AngularFire, private http: Http) {}

  public ngOnInit() {
    this.http.get('https://services.realestate.com.au/services/listings/419534970')
      .subscribe(
        (response) => this.response = response.json(),
        (err) => this.response = { err: err });

  }

  public login() {
    this.af.auth.login();
  }

  public logout() {
    this.af.auth.logout();
  }
}
