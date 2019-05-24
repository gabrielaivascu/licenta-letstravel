import { Component, OnInit, Input, OnDestroy } from '@angular/core';
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


  // position: {lat: number, lng: number} = {lat: 0, lng: 0 };

  locationList: [{ lat: number, lng: number }] = [{ lat: 0, lng: 0 }];

  @Input() location: string;

  constructor(public dialog: MatDialog, private placesService: PlacesService) {
  }

  ngOnInit() {
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
      width: '850px',
      data: { location: this.location, event: this.event }
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
      console.log(result);

      if (result.type === 'flight') {
        this.events.push('Flight to ' + result.data.value.destination);
      }
      if (result.type === 'food') {
        this.events.push('Go to ' + result.placeName);
        console.log(this.locationList.length);

        // this.lat = result.placeLocation.lat;
        // this.lng = result.placeLocation.lng;

        // this.locationList.push({ lat: this.lat, lng: this.lng });
      }
    });
  }
}
