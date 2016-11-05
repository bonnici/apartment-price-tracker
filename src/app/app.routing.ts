import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PropertiesComponent } from './properties/properties.component';
import { LoginComponent } from './login/login.component';
import { AuthGuardService } from './shared/auth-guard.service';
import { AddPropertyComponent } from './add-property/add-property.component';
import { InspectionsComponent } from './inspections/inspections.component';

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'properties', component: PropertiesComponent, canActivate: [AuthGuardService] },
  { path: 'add-property', component: AddPropertyComponent, canActivate: [AuthGuardService] },
  { path: 'inspections', component: InspectionsComponent, canActivate: [AuthGuardService] },
  { path: '', redirectTo: 'properties', pathMatch: 'full' },
  { path: '**', redirectTo: 'properties' }
];

export const appRoutingProviders: any[] = [
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
