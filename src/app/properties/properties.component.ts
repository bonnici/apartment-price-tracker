import { Component, OnInit } from '@angular/core';
import { FirebaseDataService, PropertyData, ListingData } from '../shared/firebase-data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RealestateService, Listing } from '../shared/realestate.service';
import { ListingConverterService } from '../shared/listing-converter.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-properties',
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.scss']
})
export class PropertiesComponent implements OnInit {
  public properties: PropertyData[];
  public propertiesLoading = false;
  public getPropertiesError = '';
  public selectedProperty: PropertyData;
  public sortedListings: ListingData[];
  public updatePropertyForm: FormGroup;
  public updatingProperty = false;
  public updatePropertyError: string;
  public refreshingAllProperties = false;
  public refreshAllPropertiesError: string;

  constructor(private dataService: FirebaseDataService, private realestateService: RealestateService,
              private listingConverterService: ListingConverterService, fb: FormBuilder) {
    this.updatePropertyForm = fb.group({
      propertyName: ['', Validators.required],
      propertyNotes: ['']
    });
  }

  public ngOnInit(): void {
    this.propertiesLoading = true;
    this.dataService.getProperties().subscribe(
      (properties) => {
        this.propertiesLoading = false;
        this.properties = properties;
        this.getPropertiesError = '';
      },
      (err) => {
        console.error('Error getting list of watched properties: ', err);
        this.propertiesLoading = false;
        this.properties = [];
        this.getPropertiesError = 'Error getting list of watched properties: ' + err;
      }
    );
  }

  public refreshAllProperties() {
    let observables = [];
    this.properties.forEach((property) => {
      observables.push(this.refreshProperty(property));
    });

    this.refreshingAllProperties = true;
    this.refreshAllPropertiesError = '';
    Observable.forkJoin(observables).subscribe(
      () => {},
      (err) => {
        console.error('error', err);
        this.refreshAllPropertiesError = 'Error refreshing properties: ' + err;
        this.refreshingAllProperties = false;
      },
      () => this.refreshingAllProperties = false
    );
  }

  public propertySelected(property: PropertyData) {
    this.selectedProperty = property;
    this.sortedListings = property.listings.sort((a, b) => {
      if (a.current !== b.current) {
        return a.current ? -1 : 1;
      }
      return (a.beds + a.baths) - (b.beds + b.baths);
    });
    this.updatePropertyForm.patchValue({ propertyName: property.propertyName, propertyNotes: property.propertyNotes });
  }

  public goToPreviousProperty() {
    let index = this.properties.indexOf(this.selectedProperty);
    index--;

    if (index < 0) {
      index = this.properties.length - 1;
    }
    this.propertySelected(this.properties[index]);
  }

  public goToNextProperty() {
    let index = this.properties.indexOf(this.selectedProperty);
    index++;

    if (index >= this.properties.length) {
      index = 0;
    }
    this.propertySelected(this.properties[index]);
  }

  public updateSelectedProperty() {
    this.selectedProperty.propertyName = this.updatePropertyForm.value.propertyName;
    this.selectedProperty.propertyNotes = this.updatePropertyForm.value.propertyNotes;

    this.updatingProperty = true;
    this.updatePropertyError = '';
    this.dataService.updatePropertyDetails(this.selectedProperty)
      .then(() => {
        this.updatingProperty = false;
      })
      .catch((err) => {
        console.error('Error updating property data', err);
        this.updatingProperty = false;
        this.updatePropertyError = 'Error updating property data' + err;
      });
  }

  public refreshSelectedProperty() {
    this.updatingProperty = true;
    this.updatePropertyError = '';

    this.refreshProperty(this.selectedProperty).subscribe(
      () => {},
      (err) => {
        console.error('Error updating property listings', err);
        this.updatingProperty = false;
        this.updatePropertyError = 'Error updating property data' + err;
      },
      () => {
        this.updatingProperty = false;
      }
    );
  }

  public refreshProperty(property: PropertyData): Observable<any> {
    return new Observable((observer) => {
      this.realestateService.findListingsByBoundingBox(property.latStart, property.latEnd, property.longStart, property.longEnd)
        .subscribe(
          (realestateListings) => {
            property.listings.forEach((listing) => {
              listing.current = false;
            });

            realestateListings.forEach((realestateListing) => {
              let existingListing = this.findListing(property.listings, realestateListing);
              if (existingListing) {
                existingListing.inspections = realestateListing.inspections;
                existingListing.scrapes.push({price: realestateListing.price, time: new Date().getTime()});
                existingListing.current = true;
              } else {
                let newListing = this.listingConverterService.realestateListingToListingData(realestateListing);
                newListing.current = true;
                property.listings.push(newListing);
              }
            });

            this.dataService.updatePropertyListings(property)
              .then(() => {
                observer.complete();
              })
              .catch((err) => {
                observer.error(err);
              });
          },
          (err) => {
            observer.error(err);
          }
        );
    });
  }

  public deleteSelectedProperty(property: PropertyData) {
    this.updatingProperty = true;
    this.updatePropertyError = '';
    this.dataService.deleteProperty(this.selectedProperty)
      .then(() => {
        this.updatingProperty = false;
        this.selectedProperty = null;
      })
      .catch((err) => {
        console.error('Error deleting property', err);
        this.updatingProperty = false;
        this.updatePropertyError = 'Error deleting property' + err;
      });
  }

  private findListing(listings: ListingData[], realEstateListing: Listing) {
    let foundListing: ListingData = null;

    listings.forEach((listing) => {
      if (listing.id === realEstateListing.id && listing.beds === realEstateListing.beds
          && listing.baths === realEstateListing.baths && listing.parking === realEstateListing.parking) {
        foundListing = listing;
      }
    });

    return foundListing;
  }
}
