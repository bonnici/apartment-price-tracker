import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PropertiesComponent } from './properties/properties.component';
import { LoginComponent } from './login/login.component';
import { PropertyComponent } from './property/property.component';
import { ListingComponent } from './listing/listing.component';

const appRoutes: Routes = [
  { path: '', component: PropertiesComponent },
  { path: 'login', component: LoginComponent },
  { path: 'property/:id', component: PropertyComponent },
  { path: 'property/:propId/listing/:listingId', component: ListingComponent }
];

export const appRoutingProviders: any[] = [
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
