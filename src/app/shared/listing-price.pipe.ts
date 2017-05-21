import { Pipe, PipeTransform } from '@angular/core';
import { ListingData } from './firebase-data.service';

@Pipe({name: 'listingPrice'})
export class ListingPricePipe implements PipeTransform {
  transform(listing: ListingData): string {
    const firstPrice = listing.scrapes[0].price;
    const lastPrice = listing.scrapes.slice(-1)[0].price;

    const firstPriceString = firstPrice < 10000 ? `$${firstPrice}` : `$${firstPrice / 1000}k`;
    const lastPriceString = lastPrice < 10000 ? `$${lastPrice}` : `$${lastPrice / 1000}k`;

    if (firstPrice === lastPrice) {
      return firstPriceString;
    } else {
      return `${firstPriceString} - ${lastPriceString}`;
    }
  }
}
