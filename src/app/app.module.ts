import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { MaterializeModule } from 'angular2-materialize';
import { AppComponent } from './app.component';
import { PropertiesComponent } from './properties/properties.component';
import { routing, appRoutingProviders } from './app.routing';
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
import { environment } from '../environments/environment';


// TODO: See if AoT and lazy-loading works when finalized in angular-cli

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
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
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
