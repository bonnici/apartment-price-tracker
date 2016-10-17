import { Component, OnInit } from '@angular/core';
import { FirebaseDataService, PropertyData, ListingData } from '../shared/firebase-data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import 'moment-timezone';
import { RealestateService } from '../shared/realestate.service';
import { ListingConverterService } from '../shared/listing-converter.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-properties',
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.css']
})
export class PropertiesComponent implements OnInit {
  public properties: PropertyData[];
  public propertiesLoading = false;
  public getPropertiesError = "";
  public selectedProperty: PropertyData;
  public updatePropertyForm: FormGroup;
  public updatingProperty = false;
  public deletingProperty = false;
  public updatePropertyError: string;

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
    // Error handling could go in here, for now just log any errors and ignore simultaneous updates
    this.properties.forEach((property) => {
      this.refreshProperty(property).subscribe(
        () => {},
        (err) => {
          console.error("Error updating property listings", property, err);
        },
        () => {
          console.log("Updated property listings", property);
        }
      );
    });
  }

  public propertySelected(property: PropertyData) {
    this.selectedProperty = property;
    this.updatePropertyForm.patchValue({ propertyName: property.propertyName, propertyNotes: property.propertyNotes });
  }

  public updateSelectedProperty() {
    this.selectedProperty.propertyName = this.updatePropertyForm.value.propertyName;
    this.selectedProperty.propertyNotes = this.updatePropertyForm.value.propertyNotes;

    this.updatingProperty = true;
    this.updatePropertyError = "";
    this.dataService.updatePropertyDetails(this.selectedProperty)
      .then(() => {
        this.updatingProperty = false;
      })
      .catch((err) => {
        console.error("Error updating property data", err);
        this.updatingProperty = false;
        this.updatePropertyError = "Error updating property data" + err;
      });
  }

  public refreshSelectedProperty() {
    this.updatingProperty = true;
    this.updatePropertyError = "";

    this.refreshProperty(this.selectedProperty).subscribe(
      () => {},
      (err) => {
        console.error("Error updating property listings", err);
        this.updatingProperty = false;
        this.updatePropertyError = "Error updating property data" + err;
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
            realestateListings.forEach((realestateListing) => {
              let existingListing = this.findListing(property.listings, realestateListing.id);
              if (existingListing) {
                existingListing.scrapes.push({price: realestateListing.price, time: new Date().getTime()});
              }
              else {
                property.listings.push(this.listingConverterService.realestateListingToListingData(realestateListing));
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
    this.updatePropertyError = "";
    this.dataService.deleteProperty(this.selectedProperty)
      .then(() => {
        this.updatingProperty = false;
        this.selectedProperty = null;
      })
      .catch((err) => {
        console.error("Error deleting property", err);
        this.updatingProperty = false;
        this.updatePropertyError = "Error deleting property" + err;
      });
  }

  public getPriceRange(listing: ListingData): string {
    let minPrice = listing.scrapes[0].price;
    let maxPrice = listing.scrapes[0].price;

    listing.scrapes.forEach((scrape) => {
      minPrice = Math.min(minPrice, scrape.price);
      maxPrice = Math.max(maxPrice, scrape.price);
    });

    if (minPrice === maxPrice) {
      return `$${minPrice}`;
    }
    else {
      return `$${minPrice} - $${maxPrice}`;
    }
  }

  public getAvailabilityRange(listing: ListingData): string {
    let minTime = listing.scrapes[0].time;
    let maxTime = listing.scrapes[0].time;

    listing.scrapes.forEach((scrape) => {
      minTime = Math.min(minTime, scrape.time);
      maxTime = Math.max(maxTime, scrape.time);
    });

    let minTimeMoment: any = moment(minTime); // workaround to figuring out moment-timezone typings
    let maxTimeMoment: any = moment(maxTime);
    let formattedMinTime = minTimeMoment.tz('Australia/Brisbane').format('DD/MM/YYYY');
    let formattedMaxTime = maxTimeMoment.tz('Australia/Brisbane').format('DD/MM/YYYY');

    if (formattedMinTime === formattedMaxTime) {
      return formattedMinTime;
    }
    else {
      return `${formattedMinTime} - ${formattedMaxTime}`;
    }
  }

  private findListing(listings: ListingData[], listingId: string) {
    let foundListing: ListingData = null;

    listings.forEach((listing) => {
      if (listing.id === listingId) {
        foundListing = listing;
      }
    });

    return foundListing;
  }
}
