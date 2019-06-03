import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PlacesService } from 'src/app/services/places.service';
import { FormGroup, FormControl } from '@angular/forms';
import { switchMap } from 'rxjs/operators';

export interface DialogData {
  location: string;
  event: any;
}

export interface LocationData {
  name: string,
  lat: number,
  lng: number,
  photoUrl?: string,
  category?: string
}

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  locationData: LocationData = { name: '', lat: 0, lng: 0 };

  searchResult: any;
  exploreResult: any;
  exploreResultFood: any;
  searchString: any;
  url: String;
  
  exploreFood: boolean = false;
  foodPlace: string;
  foodPlaces: any = [];
  
  exploreResultOutdoor: any;
  exploreOutdoor: boolean = false;
  outdoorPlace: string;
  outdoorPlaces: any = [];

  exploreResultShops: any;
  exploreShops: boolean = false;
  shopsPlace: string;
  shopsPlaces: any = [];
 
  selected: number;

  flightData = new FormGroup({
    destination: new FormControl(),
    startDate: new FormControl(),
    endDate: new FormControl(),
  });

  otherData = new FormGroup({
    name: new FormControl(),
    startDate: new FormControl(),
    endDate: new FormControl(),
  });

  photosUrl = new Map();

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
    let place = new Map();

    this.placesService.getPlace(this.data.location, section, 2).subscribe((result) => {
      this.exploreResultFood = Object(result).response.groups[0].items;

      for (let i = 0; i < this.exploreResultFood.length; i++) {
        this.foodPlaces.push(this.exploreResultFood[i].venue);
        let id = this.exploreResultFood[i].venue.id;

        this.placesService.getPhotos(id).subscribe((result) => {
          let url = Object(result).response.photos.items[0].prefix + '640' + Object(result).response.photos.items[0].suffix;
          this.photosUrl.set(id, url);
        });
      }
    });
  }

  explore2(section: string) {
    this.exploreOutdoor = true;

    this.placesService.getPlace(this.data.location, section, 3).subscribe((result) => {
      this.exploreResultOutdoor = Object(result).response.groups[0].items;

      for (let i = 0; i < this.exploreResultOutdoor.length; i++) {
        this.outdoorPlaces.push(this.exploreResultOutdoor[i].venue);
        let id = this.exploreResultOutdoor[i].venue.id;

        this.placesService.getPhotos(this.exploreResultOutdoor[i].venue.id).subscribe((result) => {
          let url = Object(result).response.photos.items[0].prefix + '640' + Object(result).response.photos.items[0].suffix;
          this.photosUrl.set(id, url);
        });
      }
    });
  }

  explore3(section: string) {
    this.exploreShops = true;

    this.placesService.getPlace(this.data.location, section, 3).subscribe((result) => {
      this.exploreResultShops = Object(result).response.groups[0].items;

      for (let i = 0; i < this.exploreResultShops.length; i++) {
        this.shopsPlaces.push(this.exploreResultShops[i].venue);
        let id = this.exploreResultShops[i].venue.id;

        this.placesService.getPhotos(this.exploreResultShops[i].venue.id).subscribe((result) => {
          let url = Object(result).response.photos.items[0].prefix + '640' + Object(result).response.photos.items[0].suffix;
          this.photosUrl.set(id, url);
        });
      }
    });
  }

  show(index: any) {
    console.log(index);
  }

  search(text: string, typeLocation: string) {
    this.placesService.getPlacebySearch(this.data.location, text).subscribe((result) => {
      this.searchResult = Object(result).response.venues[0];
      let id = Object(result).response.venues[0].id;
      this.placesService.getDetails(id).subscribe((result) => {
        this.searchResult.photoUrl = Object(result).response.venue.bestPhoto.prefix + '300' + Object(result).response.venue.bestPhoto.suffix;
        this.searchResult.price = Object(result).response.venue.price.currency;
        this.searchResult.priceMessage = Object(result).response.venue.price.message;
        this.searchResult.shortUrl = Object(result).response.venue.shortUrl;
      });
      this.locationData.name = this.searchResult.name;
      this.locationData.lat = this.searchResult.location.lat;
      this.locationData.lng = this.searchResult.location.lng;

      if(typeLocation === 'food') {
        this.foodPlace = this.searchResult.name;
      }
      if(typeLocation === 'outdoor') {
        this.outdoorPlace = this.searchResult.name;
      }
      if(typeLocation === 'shops') {
        this.shopsPlace = this.searchResult.name;
      }
    });
  }

  tabChanged(index: number) {
    this.selected = index;
    if (index == 1 && !this.exploreFood) {
      this.explore1('food');
    }
    if (index == 2 && !this.exploreOutdoor) {
      this.explore2('outdoor');
    }
    if (index == 3 && !this.exploreShops) {
      this.explore3('shops');
    }
  }

  submit(type: string) {
    if(type=== 'flight') {
      this.dialogRef.close({ type: 'flight', data: this.flightData });
    }
    if(type=== 'other') {
      this.dialogRef.close({ type: 'other', data: this.otherData });
    }
  }

  submitFood() {
    this.locationData.name = this.foodPlace;

    for (let j = 0; j < this.exploreResultFood.length; j++) {
      if (this.exploreResultFood[j].venue.name === this.foodPlace) {
        this.locationData.lat = this.exploreResultFood[j].venue.location.lat;
        this.locationData.lng = this.exploreResultFood[j].venue.location.lng;
      }
    }
    this.dialogRef.close({ type: 'food', place: this.locationData });
  }

  submitOutdoor() {
    this.locationData.name = this.outdoorPlace;

    for (let j = 0; j < this.exploreResultOutdoor.length; j++) {
      if (this.exploreResultOutdoor[j].venue.name === this.outdoorPlace) {
        this.locationData.lat = this.exploreResultOutdoor[j].venue.location.lat;
        this.locationData.lng = this.exploreResultOutdoor[j].venue.location.lng;
      }
    }
    this.dialogRef.close({ type: 'outdoor', place: this.locationData });
  }

  submitShops() {
    this.locationData.name = this.shopsPlace;

    for (let j = 0; j < this.exploreResultShops.length; j++) {
      if (this.exploreResultShops[j].venue.name === this.shopsPlace) {
        this.locationData.lat = this.exploreResultShops[j].venue.location.lat;
        this.locationData.lng = this.exploreResultShops[j].venue.location.lng;
      }
    }
    this.dialogRef.close({ type: 'shops', place: this.locationData });
  }
}
