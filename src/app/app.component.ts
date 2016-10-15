import { Component, OnInit } from '@angular/core';
import { AuthService } from './shared/auth.service';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/take';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(public authService: AuthService) {}

  public ngOnInit() {
  }

  public signOut() {
    this.authService.signOut();
  }
}
