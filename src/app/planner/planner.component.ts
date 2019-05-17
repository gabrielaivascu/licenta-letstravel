import { Component, OnInit, Input, Output, ViewChild, EventEmitter, Inject } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { DialogComponent } from './dialog/dialog.component';
import { PlacesService } from '../services/places.service';

@Component({
  selector: 'app-planner',
  templateUrl: './planner.component.html',
  styleUrls: ['./planner.component.scss']
})
export class PlannerComponent implements OnInit {
  nameEvent: string;
  events = [];
  types = ['Flight', 'Hotel', 'Entertainment', 'Outdoors', 'Food', 'Bar'];
  eventType: string;
  @Input() location: string;
  event: any;

  constructor(public dialog: MatDialog) {
  }

  ngOnInit() {
    console.log(this.location);
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
      width: '640px',
      data: {location: this.location, event: this.event}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
      if(result.type === 'flight') {
        this.events.push('Flight to ' + result.data.value.destination);
      }
      if(result.type === 'food') {
        this.events.push('Go to ' + result.data.name);
      }

    });
  }
}
