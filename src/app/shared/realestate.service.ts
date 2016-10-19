import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

export class Listing {
  public id: string;
  public prettyUrl: string;
  public channel: string;
  public streetAddress: string;
  public locality: string;
  public postCode: string;
  public lat: number;
  public long: number;
  public beds: number;
  public baths: number;
  public parking: number;
  public price: number;
}

@Injectable()
export class RealestateService {

  private listingUrlPrefix = 'https://services.realestate.com.au/services/listings/';
  private searchUrlPrefix = 'https://services.realestate.com.au/services/listings/search?query=';

  constructor(private http: Http) { }

  public findListingByUrl(url: string): Observable<Listing> {
    let id = this.stripIdFromUrl(url);

    if (!id) {
      return Observable.throw("Invalid URL");
    }

    return this.http.get(this.listingUrlPrefix + id)
      .map((response) => this.extractListingData(response))
      .catch((err) => {
        console.error("Error getting listing by url", err);

        if (err && err.status === 404) {
          return Observable.throw("Listing not found");
        }
        else {
          return Observable.throw("Error getting URL");
        }
      });
  }

  // Returns a max of 50 results
  public findListingsByBoundingBox(latStart: number, latEnd: number, longStart: number, longEnd: number): Observable<Listing[]> {
    let rentSearchQuery = this.generateSearchQuery(latStart, latEnd, longStart, longEnd, 'rent');
    let buySearchQuery = this.generateSearchQuery(latStart, latEnd, longStart, longEnd, 'buy');

    //var rentResults = this.http.get(this.searchUrlPrefix + rentSearchQuery).map((response) => this.extractSearchResults(response));
    //var buyResults = this.http.get(this.searchUrlPrefix + buySearchQuery).map((response) => this.extractSearchResults(response));

    return this.http.get(this.searchUrlPrefix + rentSearchQuery).map((response) => this.extractSearchResults(response))
      .concat(this.http.get(this.searchUrlPrefix + buySearchQuery).map((response) => this.extractSearchResults(response)))
      .catch((err) => {
        console.error("Error searching by bounding box", err);

        if (err && err.status === 404) {
          return Observable.throw("Listing not found");
        }
        else {
          return Observable.throw("Error searching for properties");
        }
      });

    /*
    return this.http.get(this.searchUrlPrefix + searchQuery)
      .map((response) => this.extractSearchResults(response))
      .catch((err) => {
        console.error("Error searching by bounding box", err);

        if (err && err.status === 404) {
          return Observable.throw("Listing not found");
        }
        else {
          return Observable.throw("Error searching for properties");
        }
      });
      */
  }

  private extractListingData(res: Response): Listing {
    let json = res.json();
    return this.jsonToListing(json);
  }

  private jsonToListing(json: any): Listing {
    return {
      id: json.listingId,
      prettyUrl: json._links.prettyUrl.href,
      channel: json.channel,
      streetAddress: json.address.streetAddress,
      locality: json.address.locality,
      postCode: json.address.postCode,
      lat: json.address.location.latitude,
      long: json.address.location.longitude,
      beds: json.features.general ? json.features.general.bedrooms : 0,
      baths: json.features.general ? json.features.general.bathrooms : 0,
      parking: json.features.general ? json.features.general.parkingSpaces : 0,
      price: this.parsePrice(json.price)
    };
  }

  private parsePrice(json: any): number {
    if (!json) {
      return 0;
    }

    if (json.value) {
      return json.value;
    }
    else {
      let matches = json.display.match(/[\d,]+/);
      if (matches) {
        var stripped = matches[0].replace(new RegExp(',', 'g'), '');
        return +stripped; // Convert to number
      }
      return 0;
    }
  }

  private extractSearchResults(res: Response): Listing[] {
    let json = res.json();

    let listings = [];
    if (json.tieredResults && json.tieredResults.length > 0 && json.tieredResults[0].results && json.tieredResults[0].results.length > 0) {
      listings = json.tieredResults[0].results.map((listing) => this.jsonToListing(listing));
    }

    return listings;
  }

  private stripIdFromUrl(url: string): string {
    if (!url) {
      return null;
    }

    let matches = url.match(/\d+$/);
    if (matches) {
      return matches[0];
    }

    return null;
  }

  private generateSearchQuery(latStart: number, latEnd: number, longStart: number, longEnd: number, channel: string): string {
    let query = {
      channel: channel,
      filters: {
        'surroundingSuburbs': false,
        'excludeTier2': true,
        'geoPrecision': 'address',
        'excludeAddressHidden': true
      },
      boundingBoxSearch: [latStart, longStart, latEnd, longEnd],
      pageSize: 50
    };

    return JSON.stringify(query);
  }
}
