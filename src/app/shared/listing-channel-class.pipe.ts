import { Pipe, PipeTransform } from '@angular/core';
import { ListingData } from './firebase-data.service';

@Pipe({name: 'listingChannelClass'})
export class ListingChannelClassPipe implements PipeTransform {
  transform(listing: ListingData): string {
    return listing.channel === 'buy' ? 'buy' : 'rent';
  }
}
