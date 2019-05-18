import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PlacesService } from 'src/app/services/places.service';
import { FormGroup, FormControl } from '@angular/forms';
export interface DialogData {
  location: string;
  event: any;
}

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  searchResult: any;
  exploreResult: any;
  searchString: any;
  exploreFood: boolean = false;
  url: String;

  photosPlace: any = [];

  places: any = [];

  dataToSave: any = {
    type: String,
    data: Object
  };
  selected: number;

  flightData = new FormGroup({
    destination: new FormControl(),
    startDate: new FormControl(),
    endDate: new FormControl(),
  });

  foodData = new FormGroup({
    name: new FormControl(),
    details: new FormControl
  });

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private placesService: PlacesService) { }

  ngOnInit(): void {
    console.log(this.data.location);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  explore(section: string) {
    this.exploreFood = true;
    this.placesService.getPlace(this.data.location, section).subscribe((result) => {
      this.exploreResult = Object(result).response.groups[0].items;

      for (let i = 0; i < this.exploreResult.length; i++) {
        this.places.push(this.exploreResult[i].venue.name);
        // this.places[i].name = this.exploreResult[i].venue.name;
        
          this.placesService.getPhotos(this.exploreResult[i].venue.id).subscribe((result) => {
            let url = Object(result).response.photos.items[0].prefix + '960' + Object(result).response.photos.items[0].suffix;
            this.photosPlace.push(url);
          });
        
      }
    });
  }

  search(text: string) {
    this.placesService.getPlacebySearch(this.data.location, text).subscribe((result) => {
      this.searchResult = Object(result).response.venues[0];
      console.log(result);
    })
  }

  tabChanged(index: number) {
    // console.log(e);
    this.selected = index;
    if (index == 1 && !this.exploreFood) {
      this.explore('food');
    }
  }

  submit() {
    this.dialogRef.close({ type: 'flight', data: this.flightData });
  }
  submitFood() {
    this.dialogRef.close({ type: 'food', data: this.searchResult });
  }
}
