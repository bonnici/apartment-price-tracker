import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { AuthService } from './shared/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public title = 'app works!';

  constructor(public authService: AuthService, private http: Http) {}

  public ngOnInit() {
  }

  public signOut() {
    this.authService.signOut();
  }
}
