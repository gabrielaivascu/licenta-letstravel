import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material';
import { DialogComponent } from './dialog/dialog.component';

@Component({
  selector: 'app-planner',
  templateUrl: './planner.component.html',
  styleUrls: ['./planner.component.scss']
})
export class PlannerComponent implements OnInit {
  nameEvent: string;
  events = [];
  eventType: string;
  event: any;
  lat: number = 0;
  lng: number = 0;

  @Output() newLocation = new EventEmitter();
  @Output() eventsList = new EventEmitter();
  @Input() day: any;

  @Input() location: string;
  @Input() coord: any;


  constructor(public dialog: MatDialog) {
  }

  ngOnInit() {
  }

  addEvent() {
    this.events.push(this.nameEvent);
  }

  remove(index: any) {
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

      if(result) {
        if (result.type === 'flight') {
          this.events.push({
            content: 'Flight to ' + result.data.value.destination,
            type: result.type
          });
        }
        if (result.type === 'other') {
          this.events.push({ content: result.data.value.name, type: result.type });
        }

        if (result.type === 'food') {
          if(result.place.address !== undefined) {
            this.events.push({ content: 'Eating at ' + result.place.name, type: result.type, coord: { lat: result.place.lat, lng: result.place.lng }, address: result.place.address, price: result.price });
          } else {
            this.events.push({ content: 'Eating at ' + result.place.name, type: result.type, coord: { lat: result.place.lat, lng: result.place.lng }, price: result.price });
          }
          this.newLocation.emit({ lat: result.place.lat, lng: result.place.lng });
        }
        if (result.type === 'outdoor') {
          if(result.place.address !== undefined) {
            this.events.push({ content: 'Visit ' + result.place.name, type: result.type, coord: { lat: result.place.lat, lng: result.place.lng }, address: result.place.address });
          } else {
            this.events.push({ content: 'Visit ' + result.place.name, type: result.type, coord: { lat: result.place.lat, lng: result.place.lng } });
          }
          this.newLocation.emit({ lat: result.place.lat, lng: result.place.lng });
        }
        if (result.type === 'shops') {
          if(result.place.address !== undefined) {
            this.events.push({ content: 'Shopping at ' + result.place.name, type: result.type, coord: { lat: result.place.lat, lng: result.place.lng }, address: result.place.address });
          } else {
            this.events.push({ content: 'Shopping at ' + result.place.name, type: result.type, coord: { lat: result.place.lat, lng: result.place.lng }});
          }
          this.newLocation.emit({ lat: result.place.lat, lng: result.place.lng });
        }
        if (result.type === 'hotel') {
          this.events.push({ content: 'Go to ' + result.data.value.name, type: result.type, coord: { lat:  result.data.value.coord.latitude, lng: result.data.value.coord.longitude } });
          this.newLocation.emit({ lat: result.data.value.coord.latitude, lng: result.data.value.coord.longitude });
        }
  
        this.eventsList.emit({ events: this.events, index: this.day, type: result.type });
      }
    });
  }
}
