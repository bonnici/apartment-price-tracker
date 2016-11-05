import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { UUID } from 'angular2-uuid';
import { AuthService } from './auth.service';

export class ListingScrape {
  public price: number;
  public time: number;
}

export class ListingData {
  public id: string;
  public prettyUrl: string;
  public channel: string;
  public streetAddress: string;
  public locality: string;
  public postCode: string;
  public beds: number;
  public baths: number;
  public parking: number;
  public inspections: any[];
  public scrapes: ListingScrape[];
}

export class PropertyData {
  public id: string;
  public propertyName: string;
  public propertyNotes: string;
  public latStart: number;
  public latEnd: number;
  public longStart: number;
  public longEnd: number;
  public listings: ListingData[];
}

@Injectable()
export class FirebaseDataService {

  constructor(private af: AngularFire, private authService: AuthService) { }

  public addProperty(data: PropertyData): firebase.Promise<void> {
    data.id = UUID.UUID();

    let propertiesStore = this.af.database.object(`/users/${this.authService.userId}/properties/${data.id}`);
    return propertiesStore.set(data);
  }

  public updatePropertyDetails(data: PropertyData): firebase.Promise<void> {
    let propertiesStore = this.af.database.object(`/users/${this.authService.userId}/properties/${data.id}`);
    return propertiesStore.update({ propertyName: data.propertyName, propertyNotes: data.propertyNotes });
  }

  public updatePropertyListings(data: PropertyData): firebase.Promise<void> {
    let propertiesStore = this.af.database.object(`/users/${this.authService.userId}/properties/${data.id}`);
    return propertiesStore.update({ listings: data.listings });
  }

  public getProperties(): FirebaseListObservable<PropertyData[]> {
    return this.af.database.list(`/users/${this.authService.userId}/properties`, {
      query: {
        orderByChild: 'propertyName'
      }
    });
  }

  public deleteProperty(data: PropertyData): firebase.Promise<void> {
    let propertiesStore = this.af.database.object(`/users/${this.authService.userId}/properties/${data.id}`);
    return propertiesStore.remove();
  }
}
