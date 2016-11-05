import { Injectable } from '@angular/core';
import { Listing } from './realestate.service';
import { ListingData, ListingScrape } from './firebase-data.service';

@Injectable()
export class ListingConverterService {
  public realestateListingToListingData(listing: Listing): ListingData {
    let listingData = new ListingData();
    listingData.id = listing.id;
    listingData.prettyUrl = listing.prettyUrl;
    listingData.channel = listing.channel;
    listingData.streetAddress = listing.streetAddress;
    listingData.locality = listing.locality;
    listingData.postCode = listing.postCode;
    listingData.beds = listing.beds;
    listingData.baths = listing.baths;
    listingData.parking = listing.parking;
    listingData.inspections = listing.inspections;

    let listingScrape = new ListingScrape();
    listingScrape.price = listing.price;
    listingScrape.time = new Date().getTime();
    listingData.scrapes = [listingScrape];

    return listingData;
  }
}
