import { Component, OnInit } from '@angular/core';
import { FirebaseDataService, PropertyData } from '../shared/firebase-data.service';

@Component({
  selector: 'app-properties',
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.css']
})
export class PropertiesComponent implements OnInit {
  public properties: PropertyData[];
  public getPropertiesError = "";

  constructor(private dataService: FirebaseDataService) { }

  public ngOnInit(): void {
    this.dataService.getProperties().subscribe(
      (properties) => {
        this.properties = properties;
      },
      (err) => {
        console.error("Error getting list of watched properties: ", err);
        this.getPropertiesError = "Error getting list of watched properties: " + err;
      }
    );
  }
}
