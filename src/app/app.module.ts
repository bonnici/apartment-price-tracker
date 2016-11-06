import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AuthProviders, AuthMethods, AngularFireModule } from 'angularfire2';
import { MaterializeModule } from 'angular2-materialize';
import 'materialize-css';
import { AppComponent } from './app.component';
import { PropertiesComponent } from './properties/properties.component';
import { routing, appRoutingProviders }  from './app.routing';
import { LoginComponent } from './login/login.component';
import { AuthGuardService } from './shared/auth-guard.service';
import { AuthService } from './shared/auth.service';
import { AddPropertyComponent } from './add-property/add-property.component';
import { RealestateService } from './shared/realestate.service';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { FirebaseDataService } from './shared/firebase-data.service';
import { ListingConverterService } from './shared/listing-converter.service';
import { InspectionsComponent } from './inspections/inspections.component';
import { InspectionListingPipe } from './shared/inspection-listing.pipe';
import { BedBathParkingPipe } from './shared/bed-bath-parking.pipe';
import { ListingChannelClassPipe } from './shared/listing-channel-class.pipe';
import { ListingPricePipe } from './shared/listing-price.pipe';
import { ListingAvailabilityPipe } from './shared/listing-availability.pipe';

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

// TODO: Do something about re-used/changed listings - append bed/bath/parking to listing ID?
//   e.g. http://www.realestate.com.au/property-apartment-qld-west+end-419577554
//        http://www.realestate.com.au/property-apartment-qld-west+end-419592734
// TODO: See if AoT works

@NgModule({
  declarations: [
    AppComponent,
    PropertiesComponent,
    LoginComponent,
    AddPropertyComponent,
    LoadingSpinnerComponent,
    InspectionsComponent,
    InspectionListingPipe,
    BedBathParkingPipe,
    ListingChannelClassPipe,
    ListingPricePipe,
    ListingAvailabilityPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    routing,
    AngularFireModule.initializeApp(firebaseConfig, firebaseAuthConfig),
    MaterializeModule
  ],
  providers: [
    appRoutingProviders,
    AuthService,
    AuthGuardService,
    RealestateService,
    FirebaseDataService,
    ListingConverterService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
