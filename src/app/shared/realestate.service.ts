import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

export class Listing {
  public id: string;
  public prettyUrl: string;
  public address: string;
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
    let searchQuery = this.generateSearchQuery(latStart, latEnd, longStart, longEnd);

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
  }

  private extractListingData(res: Response): Listing {
    let json = res.json();
    return this.jsonToListing(json);
  }

  private jsonToListing(json: any): Listing {
    return {
      id: json.listingId,
      prettyUrl: json._links.prettyUrl.href,
      address: `${json.address.streetAddress}, ${json.address.locality} ${json.address.postCode}`,
      lat: json.address.location.latitude,
      long: json.address.location.longitude,
      beds: json.features.general.bedrooms,
      baths: json.features.general.bathrooms,
      parking: json.features.general.parkingSpaces,
      price: this.parsePrice(json.price)
    };
  }

  private parsePrice(json: any): number {
    if (json.value) {
      return json.value;
    }
    else {
      let matches = json.display.match(/\d+/);
      if (matches) {
        return +matches[0];
      }
      return null;
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

  private generateSearchQuery(latStart: number, latEnd: number, longStart: number, longEnd: number): string {
    let query = {
      channel: 'rent',
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
