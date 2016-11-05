import { Component, OnInit } from '@angular/core';
import { FirebaseDataService, PropertyData } from '../shared/firebase-data.service';
import 'jquery';

declare class DatePickerContext {
  public select: number;
}

@Component({
  selector: 'app-inspections',
  templateUrl: './inspections.component.html',
  styleUrls: ['./inspections.component.css']
})
export class InspectionsComponent implements OnInit {
  public properties: PropertyData[];
  public propertiesLoading = false;
  public getPropertiesError = '';
  public date: Date = new Date();

  constructor(private dataService: FirebaseDataService) { }

  public ngOnInit() {
    this.setupDatePicker();

    this.propertiesLoading = true;
    this.dataService.getProperties().subscribe(
      (properties) => {
        this.propertiesLoading = false;
        this.properties = properties;
        this.getPropertiesError = '';

        console.log('loaded', properties);
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
    console.log('filtering', this.date);
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
