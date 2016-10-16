import { Component, ElementRef } from '@angular/core';
import { RealestateService, Listing } from '../shared/realestate.service';
import { ViewChild } from '@angular/core/src/metadata/di';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

declare var noUiSlider: any;
declare var wNumb: any;

@Component({
  selector: 'app-add-property',
  templateUrl: './add-property.component.html',
  styleUrls: ['./add-property.component.css']
})
export class AddPropertyComponent {
  public realestateUrl = "";
  public realestateUrlError = "";
  public searchingForSourceListing = false;
  public foundListing: Listing;
  public searchingForOtherListings = false;
  public searchResultListings: Listing[] = [];
  public searchResultListingError = "";
  public addPropertyForm: FormGroup;

  @ViewChild('latSlider') latSlider: ElementRef;
  @ViewChild('longSlider') longSlider: ElementRef;

  constructor(private realestateService: RealestateService, fb: FormBuilder) {
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
    console.log('adding', this.addPropertyForm.value.propertyName, this.addPropertyForm.value.propertyNotes, this.latStart, this.latEnd, this.longStart, this.longEnd);
  }

  private searchForLatLong() {
    this.searchingForOtherListings = true;
    this.searchResultListings = [];
    this.searchResultListingError = "";
    this.realestateService.findListingsByBoundingBox(this.latStart, this.latEnd, this.longStart, this.longEnd)
      .subscribe(
        (listings) => {
          this.searchingForOtherListings = false;
          this.searchResultListings = listings;

          if (this.searchResultListings.length == 0) {
            this.searchResultListingError = "Could not find any results";
          }
        },
        (err) => {
          this.searchingForOtherListings = false;
          this.searchResultListingError = err;
        }
      );
  }

  private get latStart() {
    let latValues = this.latSlider.nativeElement.noUiSlider.get();
    return +latValues[0];
  }

  private get latEnd() {
    let latValues = this.latSlider.nativeElement.noUiSlider.get();
    return +latValues[1];
  }

  private get longStart() {
    let longValues = this.longSlider.nativeElement.noUiSlider.get();
    return +longValues[0];
  }

  private get longEnd() {
    let longValues = this.longSlider.nativeElement.noUiSlider.get();
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

    let rounded = Math.round(value * 10000) / 10000;

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
