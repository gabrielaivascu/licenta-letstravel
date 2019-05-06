import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-planner',
  templateUrl: './planner.component.html',
  styleUrls: ['./planner.component.scss']
})
export class PlannerComponent implements OnInit {
  nameEvent: string;
  events = [];

  @ViewChild("placesRef") placesRef: GooglePlaceDirective;

  public handleAddressChange(address: Address) {
    console.log(address.name);
    // Do some stuff
  }

  constructor() {
  }

  ngOnInit() {

  }

  addEvent() {
    this.events.push(this.nameEvent);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.events, event.previousIndex, event.currentIndex);
  }
}
