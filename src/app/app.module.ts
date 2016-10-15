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

const myFirebaseConfig = {
  apiKey: 'AIzaSyAEkS5Heb7Hv0JbmOF9_VlhkCl64FhGyIo',
  authDomain: 'apartment-price-tracker.firebaseapp.com',
  databaseURL: 'https://apartment-price-tracker.firebaseio.com',
  storageBucket: 'apartment-price-tracker.appspot.com',
};

const myFirebaseAuthConfig = {
  provider: AuthProviders.Google,
  method: AuthMethods.Redirect
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
    AngularFireModule.initializeApp(myFirebaseConfig, myFirebaseAuthConfig)
  ],
  providers: [appRoutingProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
