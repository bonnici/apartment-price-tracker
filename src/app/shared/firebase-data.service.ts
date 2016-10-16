import { Injectable } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { UUID } from 'angular2-uuid';
import { AuthService } from './auth.service';

export class ListingScrape {
  public price: number;
  public time: number;
}

export class ListingData {
  public id: string;
  public prettyUrl: string;
  public streetAddress: string;
  public locality: string;
  public postCode: string;
  public beds: number;
  public baths: number;
  public parking: number;
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
}
