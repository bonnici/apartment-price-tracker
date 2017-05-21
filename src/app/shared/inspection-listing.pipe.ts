import { Pipe, PipeTransform } from '@angular/core';
import { Inspection } from '../inspections/inspections.component';

@Pipe({name: 'inspectionListing'})
export class InspectionListingPipe implements PipeTransform {
  transform(inspection: Inspection): string {
    let apt = '';
    const matches = inspection.listing.streetAddress.match(/^([\w\d]+)\//);
    if (matches) {
      apt = `${matches[1]}/`;
    }

    return `${apt}${inspection.property.propertyName}`;
  }
}
