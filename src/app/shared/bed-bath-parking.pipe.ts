import { Pipe, PipeTransform } from '@angular/core';
import { ListingData } from './firebase-data.service';

@Pipe({name: 'bedBathParking'})
export class BedBathParkingPipe implements PipeTransform {
  transform(listing: ListingData): string {
    return `${listing.beds}/${listing.beds}/${listing.parking}`;
  }
}
