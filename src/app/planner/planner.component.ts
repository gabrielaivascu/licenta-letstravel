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
    console.log(this.day)
  }

  ngOnDestroy() {
  }

  save() {

  }

  addEvent() {
    this.events.push(this.nameEvent);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.events, event.previousIndex, event.currentIndex);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '860px',
      height: '650px',
      data: { location: this.location, event: this.event }
    });

    dialogRef.afterClosed().subscribe(result => {
 
      if (result.type === 'flight') {
        this.events.push('Flight to ' + result.data.value.destination);
      }
      if (result.type === 'other') {
        this.events.push(result.data.value.name);
      }
      if (result.type === 'food') {
        this.events.push('Go to ' + result.place.name);
        this.newLocation.emit({ lat: result.place.lat, lng:  result.place.lng });
      }
      if (result.type === 'outdoor') {
        this.events.push('Visit ' + result.place.name);
        this.newLocation.emit({ lat: result.place.lat, lng:  result.place.lng });
      }
      if (result.type === 'shops') {
        this.events.push('Shopping at ' + result.place.name);
        this.newLocation.emit({ lat: result.place.lat, lng:  result.place.lng });
      }

      this.eventsList.emit({events: this.events, index: this.day, type: result.type});
    });
  }
}
