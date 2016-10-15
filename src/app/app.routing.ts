import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PropertiesComponent } from './properties/properties.component';
import { LoginComponent } from './login/login.component';
import { PropertyComponent } from './property/property.component';
import { ListingComponent } from './listing/listing.component';
import { AuthGuardService } from './shared/auth-guard.service';

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: PropertiesComponent, canActivate: [AuthGuardService] },
  { path: 'property/:id', component: PropertyComponent, canActivate: [AuthGuardService] },
  { path: 'property/:propId/listing/:listingId', component: ListingComponent, canActivate: [AuthGuardService] }
];

export const appRoutingProviders: any[] = [
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
