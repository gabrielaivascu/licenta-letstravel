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
  exploreResultFood: any;
  exploreResultOutdoor: any;
  searchString: any;
  url: String;

  exploreFood: boolean = false;
  exploreOutdoor: boolean = false;
  foodPlace: string;
  foodPlaceLocation: {lat: any, lng: any} = {lat: '', lng: ''};
  foodPhotosPlace: any = [];
  foodPlaces: any = [];

  outdoorPlace: string;
  outdoorPlaceLocation: {lat: any, lng: any} = {lat: '', lng: ''};
  outdoorPhotosPlace: any = [];
  outdoorPlaces: any = [];

  selected: number;

  flightData = new FormGroup({
    destination: new FormControl(),
    startDate: new FormControl(),
    endDate: new FormControl(),
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

  explore1(section: string) {
    this.exploreFood = true;

    this.placesService.getPlace(this.data.location, section, 1).subscribe((result) => {
      this.exploreResultFood = Object(result).response.groups[0].items;

      for (let i = 0; i < this.exploreResultFood.length; i++) {
        this.foodPlaces.push(this.exploreResultFood[i].venue.name);

          this.placesService.getPhotos(this.exploreResultFood[i].venue.id).subscribe((result) => {
            let url = Object(result).response.photos.items[0].prefix + '960' + Object(result).response.photos.items[0].suffix;
            this.foodPhotosPlace.push(url);
          });
        
      }
    });
  }

  explore2(section: string) {
    this.exploreOutdoor = true;

    this.placesService.getPlace(this.data.location, section, 1).subscribe((result) => {
      this.exploreResultOutdoor = Object(result).response.groups[0].items;

      for (let i = 0; i < this.exploreResultOutdoor.length; i++) {
        this.outdoorPlaces.push(this.exploreResultOutdoor[i].venue.name);

          this.placesService.getPhotos(this.exploreResultOutdoor[i].venue.id).subscribe((result) => {
            let url = Object(result).response.photos.items[0].prefix + '960' + Object(result).response.photos.items[0].suffix;
            this.outdoorPhotosPlace.push(url);
          });
        
      }
    });
  }

  search(text: string) {
    this.placesService.getPlacebySearch(this.data.location, text).subscribe((result) => {
      this.searchResult = Object(result).response.venues[0];
      console.log(result);
      this.foodPlace = this.searchResult.name;
      this.foodPlaceLocation.lat = this.searchResult.location.lat;
      this.foodPlaceLocation.lng = this.searchResult.location.lng;
    })
  }

  tabChanged(index: number) {
    // console.log(e);
    this.selected = index;
    if (index == 1 && !this.exploreFood) {
      this.explore1('food');
    }
    if (index == 2 && !this.exploreOutdoor) {
      this.explore2('outdoor');
    }
  }

  submit() {
    this.dialogRef.close({ type: 'flight', data: this.flightData });
  }

  submitFood() {
    for(let j=0;j<this.exploreResultFood.length; j++) {
      console.log(this.exploreResultFood[j].venue.name);
      if(this.exploreResultFood[j].venue.name === this.foodPlace) {
        this.foodPlaceLocation.lat = this.exploreResultFood[j].venue.location.lat;
        this.foodPlaceLocation.lng = this.exploreResultFood[j].venue.location.lng;
      }
    }
    this.dialogRef.close({ type: 'food', placeName: this.foodPlace, placeLocation: this.foodPlaceLocation });
  }
}
