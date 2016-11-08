import { Component, OnInit } from '@angular/core';
import { FirebaseDataService, PropertyData, ListingData } from '../shared/firebase-data.service';
import 'jquery';
import * as moment from 'moment';

declare class DatePickerContext {
  public select: number;
}

export class Inspection {
  public property: PropertyData;
  public listing: ListingData;
  public startTime: any; // moment
  public endTime: any; // moment
}

@Component({
  selector: 'app-inspections',
  templateUrl: './inspections.component.html',
  styleUrls: ['./inspections.component.scss']
})
export class InspectionsComponent implements OnInit {
  public properties: PropertyData[];
  public propertiesLoading = false;
  public getPropertiesError = '';
  public date: Date = new Date();
  public inspections: Inspection[] = [];

  constructor(private dataService: FirebaseDataService) { }

  public ngOnInit() {
    this.setupDatePicker();

    this.propertiesLoading = true;
    this.dataService.getProperties().subscribe(
      (properties) => {
        this.propertiesLoading = false;
        this.properties = properties;
        this.getPropertiesError = '';
        this.filterInspections();
      },
      (err) => {
        console.error('Error getting list of watched properties: ', err);
        this.propertiesLoading = false;
        this.properties = [];
        this.getPropertiesError = 'Error getting list of watched properties: ' + err;
      }
    );
  }

  public filterInspections() {
    let filteredInspections: Inspection[] = [];

    this.properties.forEach((property) => {
      property.listings.forEach((listing) => {
        (listing.inspections || [])
          .forEach((inspection) => {
            if (listing.current && moment(inspection.startTime).startOf('day').isSame(moment(this.date).startOf('day'))) {
              filteredInspections.push({
                property: property,
                listing: listing,
                startTime: moment(inspection.startTime),
                endTime: moment(inspection.endTime)
              });
            }
          });
      });
    });

    filteredInspections.sort((a: Inspection, b: Inspection) => {
      if (a.property.propertyName !== b.property.propertyName) {
        return a.property.propertyName < b.property.propertyName ? -1 : 1;
      } else {
        return a.startTime.isBefore(b.startTime) ? -1 : 1;
      }
    });

    this.inspections = filteredInspections;
  }

  // Need to set up date picker this way because the materialize way is not very customizable
  private setupDatePicker() {
    let dateInput: any = jQuery('#date');
    let pickadate = dateInput.pickadate({
      format: 'dd/mm/yyyy',
      selectMonths: true,
      selectYears: 2,
      min: this.date,
      onClose: () => {
        $(document.activeElement).blur(); // https://github.com/amsul/pickadate.js/issues/160
        this.filterInspections();
      },
      onSet: (context: DatePickerContext) => {
        this.date = new Date(context.select);
      }
    });

    let picker = pickadate.pickadate('picker');
    picker.set('select', this.date);
  }
}
