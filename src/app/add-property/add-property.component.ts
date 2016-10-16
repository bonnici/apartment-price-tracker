import { Component } from '@angular/core';
import { RealestateService, Listing } from '../shared/realestate.service';

@Component({
  selector: 'app-add-property',
  templateUrl: './add-property.component.html',
  styleUrls: ['./add-property.component.css']
})
export class AddPropertyComponent {
  public realestateUrl = "";
  public realestateUrlError = "";
  public foundListing: Listing;
  public searchLatStart: number;
  public searchLatEnd: number;
  public searchLongStart: number;
  public searchLongEnd: number;
  public searchResultListings: Listing[];

  constructor(private realestateService: RealestateService) { }

  public findProperty() {
    console.log('searching for', this.realestateUrl);

    this.realestateService.findListingByUrl(this.realestateUrl).subscribe(
      (listing) => {
        this.foundListing = listing;
        this.realestateUrlError = null;
        this.updateSearchLatLong();
        this.searchForLatLong();
      },
      (err) => {
        this.foundListing = null;
        this.realestateUrlError = err;
        this.updateSearchLatLong();
        this.searchResultListings = [];
      }
    );
  }

  public searchForLatLong() {
    if (!this.searchLatStart || !this.searchLatEnd || !this.searchLongStart || !this.searchLongEnd) {
      return;
    }

    this.realestateService.findListingsByBoundingBox(this.searchLatStart, this.searchLatEnd, this.searchLongStart, this.searchLongEnd)
      .subscribe(
        (listings) => {
          this.searchResultListings = listings;
        },
        (err) => {
          //todo show error somewhere
          console.error(err);
          this.searchResultListings = [];
        }
      );
  }

  private updateSearchLatLong() {
    if (this.foundListing) {
      // Round to 4th decimal place
      let roundedLat = Math.round(this.foundListing.lat * 10000) / 10000;
      let roundedLong = Math.round(this.foundListing.long * 10000) / 10000;

      // Add a 4th decimal place padding each way
      this.searchLatStart = roundedLat + 0.0001;
      this.searchLatEnd = roundedLat - 0.0001;
      this.searchLongStart = roundedLong - 0.0001;
      this.searchLongEnd = roundedLong + 0.0001;
    }
    else {
      this.searchLatStart = null;
      this.searchLatEnd = null;
      this.searchLongStart = null;
      this.searchLongEnd = null;
    }
  }
}
