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
  lat: number = 0;
  lng: number = 0;

  @Output() newLocation = new EventEmitter();
  @Output() eventsList = new EventEmitter();
  @Input() day: any;

  @Input() location: string;
  @Input() coord: any;
  origin: { lat: number; lng: number; };
  destination: { lat: number; lng: number; };

  constructor(public dialog: MatDialog, private placesService: PlacesService) {
  }

  ngOnInit() {
  }

  ngOnDestroy() {
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
  locationList: any = [];

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
            type: 'flight'
          });
        }
        if (result.type === 'other') {
          this.events.push({ content: result.data.value.name, type: 'other' });
        }
        if (result.type === 'food') {
          this.events.push({ content: 'Eating at ' + result.place.name, type: 'food', coord: { lat: result.place.lat, lng: result.place.lng }, address: result.place.address, price: result.price });
          this.newLocation.emit({ lat: result.place.lat, lng: result.place.lng });
        }
        if (result.type === 'outdoor') {
          this.events.push({ content: 'Visit ' + result.place.name, type: 'outdoor', coord: { lat: result.place.lat, lng: result.place.lng }, address: result.place.address  });
          this.newLocation.emit({ lat: result.place.lat, lng: result.place.lng });
        }
        if (result.type === 'shops') {
          this.events.push({ content: 'Shopping at ' + result.place.name, type: 'shop', coord: { lat: result.place.lat, lng: result.place.lng }, address: result.place.address });
          this.newLocation.emit({ lat: result.place.lat, lng: result.place.lng });
        }
        if (result.type === 'hotel') {
          this.events.push({ content: 'Go to ' + result.data.value.name, type: 'hotel', coord: { lat:  result.data.value.coord.latitude, lng: result.data.value.coord.longitude } });
          this.newLocation.emit({ lat: result.data.value.coord.latitude, lng: result.data.value.coord.longitude });
        }
  
        this.eventsList.emit({ events: this.events, index: this.day, type: result.type });
      }
    });
  }
}
