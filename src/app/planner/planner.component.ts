import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material';
import { DialogComponent } from './dialog/dialog.component';
import { PlacesService } from '../services/places.service';

@Component({
  selector: 'app-planner',
  templateUrl: './planner.component.html',
  styleUrls: ['./planner.component.scss']
})
export class PlannerComponent implements OnInit, OnDestroy {
  nameEvent: string;
  events = [];
  eventType: string;
  event: any;

  @Output() newLocation = new EventEmitter();
  @Output() eventsList = new EventEmitter();
  @Input() day: any;

  // position: {lat: number, lng: number} = {lat: 0, lng: 0 };

  // locationList: [{ lat: number, lng: number }] = [{ lat: 0, lng: 0 }];

  @Input() location: string;

  constructor(public dialog: MatDialog, private placesService: PlacesService) {
  }

  ngOnInit() {
    // console.log(this.day)
  }

  ngOnDestroy() {
  }

  save() {

  }

  addEvent() {
    this.events.push(this.nameEvent);
  }

  remove(index: any) {
    console.log(index);
    this.events.splice(index, 1);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.events, event.previousIndex, event.currentIndex);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '860px',
      height: '640px',
      data: { location: this.location, event: this.event }
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result.type === 'flight') {
        this.events.push({
          content: 'Flight to ' + result.data.value.destination,
          type: 'flight',
          coord: { lat: result.data.value.airportLocation.latitude, lng: result.data.value.airportLocation.longitude } 
        });
      }
      if (result.type === 'other') {
        this.events.push({ content: result.data.value.name, type: 'other' });
      }
      if (result.type === 'food') {
        this.events.push({ content: 'Eating at ' + result.place.name, type: 'food', coord: { lat: result.place.lat, lng: result.place.lng } });
        this.newLocation.emit({ lat: result.place.lat, lng: result.place.lng });
      }
      if (result.type === 'outdoor') {
        this.events.push({ content: 'Visit ' + result.place.name, type: 'outdoor', coord: { lat: result.place.lat, lng: result.place.lng } });
        this.newLocation.emit({ lat: result.place.lat, lng: result.place.lng });
      }
      if (result.type === 'shops') {
        this.events.push({ content: 'Shopping at ' + result.place.name, type: 'shop', coord: { lat: result.place.lat, lng: result.place.lng } });
        this.newLocation.emit({ lat: result.place.lat, lng: result.place.lng });
      }
      if (result.type === 'hotel') {
        // console.log(result.data.value);
        this.events.push({ content: 'Go to ' + result.data.value.name, type: 'hotel', coord: { lat:  result.data.value.coord.latitude, lng:  result.data.value.coord.longitude }, });
        this.newLocation.emit({ lat: result.data.value.coord.latitude, lng: result.data.value.coord.longitude });
      }

      this.eventsList.emit({ events: this.events, index: this.day, type: result.type });
    });
  }
}
