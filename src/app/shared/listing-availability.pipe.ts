import { Pipe, PipeTransform } from '@angular/core';
import { ListingData } from './firebase-data.service';
import * as moment from 'moment';
import 'moment-timezone';

@Pipe({name: 'listingAvailability'})
export class ListingAvailabilityPipe implements PipeTransform {
  transform(listing: ListingData): string {
    let minTime = listing.scrapes[0].time;
    let maxTime = listing.scrapes.slice(-1)[0].time;

    let minTimeMoment: any = moment(minTime); // workaround to figuring out moment-timezone typings
    let maxTimeMoment: any = moment(maxTime);
    let formattedMinTime = minTimeMoment.tz('Australia/Brisbane').format('DD/MM/YYYY');
    let formattedMaxTime = maxTimeMoment.tz('Australia/Brisbane').format('DD/MM/YYYY');

    if (formattedMinTime === formattedMaxTime) {
      return formattedMinTime;
    } else {
      return `${formattedMinTime} - ${formattedMaxTime}`;
    }
  }
}
