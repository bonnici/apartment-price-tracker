import { Component, ElementRef } from '@angular/core';
import { RealestateService, Listing } from '../shared/realestate.service';
import { ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FirebaseDataService, PropertyData } from '../shared/firebase-data.service';
import { Router } from '@angular/router';
import { ListingConverterService } from '../shared/listing-converter.service';

declare var noUiSlider: any;
declare var wNumb: any;

@Component({
  selector: 'app-add-property',
  templateUrl: './add-property.component.html',
  styleUrls: ['./add-property.component.css']
})
export class AddPropertyComponent {
  public realestateUrl = '';
  public realestateUrlError = '';
  public searchingForSourceListing = false;
  public foundListing: Listing;
  public searchingForOtherListings = false;
  public searchResultListings: Listing[] = [];
  public searchResultListingError = '';
  public addPropertyForm: FormGroup;
  public addingProperty = false;
  public addPropertyError = '';

  @ViewChild('latSlider') latSlider: ElementRef;
  @ViewChild('longSlider') longSlider: ElementRef;

  constructor(private realestateService: RealestateService, private dataService: FirebaseDataService, private router: Router,
              private listingConverterService: ListingConverterService, fb: FormBuilder) {
    this.addPropertyForm = fb.group({
      propertyName: ['', Validators.required],
      propertyNotes: ['']
    });
  }

  public findProperty() {
    this.searchingForSourceListing = true;
    this.realestateService.findListingByUrl(this.realestateUrl).subscribe(
      (listing) => {
        this.searchingForSourceListing = false;
        this.foundListing = listing;
        this.realestateUrlError = null;

        this.addPropertyForm.patchValue({ propertyName: listing.streetAddress, propertyNotes: '' });
        this.updateSearchLatLongFromFoundListing();
        this.searchForLatLong();
      },
      (err) => {
        this.searchingForSourceListing = false;
        this.foundListing = null;
        this.realestateUrlError = err;
        this.searchResultListings = [];
      }
    );
  }

  public addProperty() {
    const propertyData = new PropertyData();
    propertyData.propertyName = this.addPropertyForm.value.propertyName;
    propertyData.propertyNotes = this.addPropertyForm.value.propertyNotes;
    propertyData.latStart = this.latStart;
    propertyData.latEnd = this.latEnd;
    propertyData.longStart = this.longStart;
    propertyData.longEnd = this.longEnd;
    propertyData.listings = this.searchResultListings.map(
      (listing) => this.listingConverterService.realestateListingToListingData(listing));

    this.addingProperty = true;
    this.addPropertyError = '';
    this.dataService.addProperty(propertyData)
      .then(() => {
        this.addingProperty = false;
        this.router.navigate(['']);
      })
      .catch((err) => {
        console.error('Error storing property data', err);
        this.addingProperty = false;
        this.addPropertyError = 'Error storing property data' + err;
      });
  }

  private searchForLatLong() {
    this.searchingForOtherListings = true;
    this.searchResultListings = [];
    this.searchResultListingError = '';
    this.realestateService.findListingsByBoundingBox(this.latStart, this.latEnd, this.longStart, this.longEnd)
      .subscribe(
        (listings) => {
          this.searchingForOtherListings = false;
          this.searchResultListings = listings;

          if (this.searchResultListings.length === 0) {
            this.searchResultListingError = 'Could not find any results';
          }
        },
        (err) => {
          this.searchingForOtherListings = false;
          this.searchResultListingError = err;
        }
      );
  }

  private get latStart() {
    const latValues = this.latSlider.nativeElement.noUiSlider.get();
    return +latValues[0];
  }

  private get latEnd() {
    const latValues = this.latSlider.nativeElement.noUiSlider.get();
    return +latValues[1];
  }

  private get longStart() {
    const longValues = this.longSlider.nativeElement.noUiSlider.get();
    return +longValues[0];
  }

  private get longEnd() {
    const longValues = this.longSlider.nativeElement.noUiSlider.get();
    return +longValues[1];
  }

  private updateSearchLatLongFromFoundListing() {
    if (this.foundListing) {
      this.updateLatLongSlider(this.latSlider, this.foundListing.lat);
      this.updateLatLongSlider(this.longSlider, this.foundListing.long);
    }
  }

  private updateLatLongSlider(slider: ElementRef, value: number) {
    if (slider.nativeElement.noUiSlider) {
      slider.nativeElement.noUiSlider.destroy();
    }

    const rounded = Math.round(value * 10000) / 10000;

    noUiSlider.create(slider.nativeElement, {
      start: [rounded - 0.0002, rounded + 0.0002],
      connect: true,
      step: 0.0001,
      tooltips: true,
      range: {
        'min': rounded - 0.001,
        'max': rounded + 0.001,
      },
      format: wNumb({
        decimals: 4
      }),
      tooltip: false
    });

    slider.nativeElement.noUiSlider.on('change', () => { this.searchForLatLong(); });
  }
}
