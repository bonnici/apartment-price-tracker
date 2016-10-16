import { Component, OnInit } from '@angular/core';
import { FirebaseDataService, PropertyData, ListingData } from '../shared/firebase-data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';

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

  constructor(private dataService: FirebaseDataService, fb: FormBuilder) {
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

  public propertySelected(property: PropertyData) {
    this.selectedProperty = property;
    this.updatePropertyForm.patchValue({ propertyName: property.propertyName, propertyNotes: property.propertyNotes });
  }

  public updateSelectedProperty() {
    this.selectedProperty.propertyName = this.updatePropertyForm.value.propertyName;
    this.selectedProperty.propertyNotes = this.updatePropertyForm.value.propertyNotes;

    this.updatingProperty = true;
    this.dataService.updateProperty(this.selectedProperty)
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
    console.log("refreshSelectedProperty", this.selectedProperty);
  }

  public deleteSelectedProperty(property: PropertyData) {
    console.log("deleteSelectedProperty", this.selectedProperty);

    this.updatingProperty = true;
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

    if (minTime === maxTime) {
      return moment(minTime).format('DD/MM/YYYY');
    }
    else {
      return `${moment(minTime).format('DD/MM/YYYY')} - ${moment(maxTime).format('DD/MM/YYYY')}`;
    }
  }
}
