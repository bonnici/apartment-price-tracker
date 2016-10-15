import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AuthProviders, AuthMethods, AngularFireModule } from 'angularfire2';
import { AppComponent } from './app.component';
import { PropertiesComponent } from './properties/properties.component';
import { routing, appRoutingProviders }  from './app.routing';
import { LoginComponent } from './login/login.component';
import { PropertyComponent } from './property/property.component';
import { ListingComponent } from './listing/listing.component';
import { AuthGuardService } from './shared/auth-guard.service';
import { AuthService } from './shared/auth.service';

const firebaseConfig = {
  apiKey: 'AIzaSyAEkS5Heb7Hv0JbmOF9_VlhkCl64FhGyIo',
  authDomain: 'apartment-price-tracker.firebaseapp.com',
  databaseURL: 'https://apartment-price-tracker.firebaseio.com',
  storageBucket: 'apartment-price-tracker.appspot.com',
};

const firebaseAuthConfig = {
  provider: AuthProviders.Google,
  method: AuthMethods.Popup
};

@NgModule({
  declarations: [
    AppComponent,
    PropertiesComponent,
    LoginComponent,
    PropertyComponent,
    ListingComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    AngularFireModule.initializeApp(firebaseConfig, firebaseAuthConfig)
  ],
  providers: [
    appRoutingProviders,
    AuthService,
    AuthGuardService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
