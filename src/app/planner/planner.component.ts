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
  lat: number = 51.678418;
  lng: number = 7.809007;

  // position: {lat: number, lng: number} = {lat: 0, lng: 0 };

  locationList: [{ lat: number, lng: number }] = [{ lat: 0, lng: 0 }];

  zoom: number = 13;
  @Input() location: string;

  constructor(public dialog: MatDialog, private placesService: PlacesService) {
  }

  ngOnInit() {
    console.log(localStorage.getItem('location'));
    if (localStorage.getItem('location') != this.location && this.location) {
      localStorage.setItem('location', this.location);

      this.placesService.getPlace(this.location, 'trending', 1).subscribe((result) => {
        console.log(result);
        this.lat = Object(result).response.groups[0].items[0].venue.location.lat;
        this.lng = Object(result).response.groups[0].items[0].venue.location.lng;
      });
    }
  }

  ngOnDestroy() {
    localStorage.setItem('location', '');
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

        this.lat = result.placeLocation.lat;
        this.lng = result.placeLocation.lng;

        this.locationList.push({ lat: this.lat, lng: this.lng });
      }
    });
  }
}
