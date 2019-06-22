import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PlacesService } from 'src/app/services/places.service';
import { FormGroup, FormControl } from '@angular/forms';
import PlaceResult = google.maps.places.PlaceResult;

export interface DialogData {
  location: string;
  event: any;
}

export interface LocationData {
  name: string,
  lat: number,
  lng: number,
  photoUrl?: string,
  category?: string,
  address?: string
}

export interface Place {
  name: string,
  id: string,
  category: any,
  lat: number,
  lng: number,
  address: string,
  price?: any
}

export interface exploreResults {
  food: { selected: boolean, values: Array<Place> }
  outdoor: { selected: boolean, values: Array<Place> },
  shops: { selected: boolean, values: Array<Place> }
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

  foodPlace: string;
  outdoorPlace: string;
  shopsPlace: string;


  exploreResults: exploreResults = {
    food: { selected: false, values: [] },
    outdoor: { selected: false, values: [] },
    shops: { selected: false, values: [] }
  };

  selected: number;

  flightData = new FormGroup({
    destination: new FormControl(),
    startDate: new FormControl(),
    endDate: new FormControl(),
  });

  hotelData = new FormGroup({
    name: new FormControl(),
    coord: new FormControl(),
    startDate: new FormControl()
  });

  otherData = new FormGroup({
    name: new FormControl(),
    startDate: new FormControl(),
    endDate: new FormControl(),
  });

  photosUrl = new Map();
  priceFood = new Map();

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private placesService: PlacesService) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  explore(section: string) {
    switch (section) {
      case "outdoor": {
        this.exploreResults.outdoor.selected = true;
        break;
      }
      case "food": {
        this.exploreResults.food.selected = true;
        break;
      }
      case "shops": {
        this.exploreResults.shops.selected = true;
        break;
      }
      default: {
        console.log("invalid");
      }
    }
    this.placesService.getPlace(this.data.location, section, 4).subscribe((result) => {
      let exploreResult = Object(result).response.groups[0].items;

      for (let i = 0; i < exploreResult.length; i++) {
        switch (section) {
          case "food": {
            this.exploreResults.food.values.push({
              name: exploreResult[i].venue.name,
              id: exploreResult[i].venue.id,
              category: exploreResult[i].venue.categories[0],
              lat: exploreResult[i].venue.location.lat,
              lng: exploreResult[i].venue.location.lng,
              address: exploreResult[i].venue.location.address
            });
            break;
          }
          case "outdoor": {
            this.exploreResults.outdoor.values.push({
              name: exploreResult[i].venue.name,
              id: exploreResult[i].venue.id,
              category: exploreResult[i].venue.categories[0],
              lat: exploreResult[i].venue.location.lat,
              lng: exploreResult[i].venue.location.lng,
              address: exploreResult[i].venue.location.address
            });
            break;
          }
          case "shops": {
            this.exploreResults.shops.values.push({
              name: exploreResult[i].venue.name,
              id: exploreResult[i].venue.id,
              category: exploreResult[i].venue.categories[0],
              lat: exploreResult[i].venue.location.lat,
              lng: exploreResult[i].venue.location.lng,
              address: exploreResult[i].venue.location.address
            });
            break;
          }
          default: {
            console.log("invalid");
          }
        }

        let id = exploreResult[i].venue.id;
        this.placesService.getPhotos(id).subscribe((result) => {
          let url = Object(result).response.photos.items[0].prefix + '640' + Object(result).response.photos.items[0].suffix;
          this.photosUrl.set(id, url);
        });
        if(section === 'food') {
          this.placesService.getDetails(id).subscribe((result) => {
            if(Object(result).response.venue.price !== undefined) {
              let priceTier = Object(result).response.venue.price.tier;
              this.priceFood.set(id, priceTier);
            }
          });
        }
      }
    });
  }

  onLocationSelected(location: Location, type: String) {
    if(type === 'hotel') {
      this.hotelData.patchValue({ coord: location });
    }
  }

  onAutocompleteSelected(result: PlaceResult, type: String) {
    if(type === 'hotel') {
      this.hotelData.patchValue({ name: result.name });
    }
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
      this.locationData.address = this.searchResult.location.address;

      if (typeLocation === 'food') {
        this.foodPlace = this.searchResult.name;
      }
      if (typeLocation === 'outdoor') {
        this.outdoorPlace = this.searchResult.name;
      }
      if (typeLocation === 'shops') {
        this.shopsPlace = this.searchResult.name;
      }
    });
  }

  tabChanged(index: number) {
    this.selected = index;
    if (index == 2 && !this.exploreResults.food.selected) {
      this.explore('food');
    }
    if (index == 3 && !this.exploreResults.outdoor.selected) {
      this.explore('outdoor');
    }
    if (index == 4 && !this.exploreResults.shops.selected) {
      this.explore('shops');
    }
  }

  submit(type: string) {
    if (type === 'flight') {
      this.dialogRef.close({ type: 'flight', data: this.flightData });
    }
    if (type === 'other') {
      this.dialogRef.close({ type: 'other', data: this.otherData });
    }
    if (type === 'hotel') {
      this.dialogRef.close({ type: 'hotel', data: this.hotelData });
    }
  }

  submitFood() {
    this.locationData.name = this.foodPlace;
    let priceTier = null;

    for (let j = 0; j < this.exploreResults.food.values.length; j++) {
      if (this.exploreResults.food.values[j].name === this.foodPlace) {
        this.locationData.lat = this.exploreResults.food.values[j].lat;
        this.locationData.lng = this.exploreResults.food.values[j].lng;
        if(this.exploreResults.food.values[j].address !== undefined) {
          this.locationData.address = this.exploreResults.food.values[j].address;
        }
        let id = Number(this.exploreResults.food.values[j].id);
        if(this.priceFood.get(this.exploreResults.food.values[j].id) !== undefined) {
          priceTier = this.priceFood.get(this.exploreResults.food.values[j].id);
        }
      }
    }
    this.dialogRef.close({ type: 'food', place: this.locationData, price: priceTier });
  }

  submitOutdoor() {
    this.locationData.name = this.outdoorPlace;

    for (let j = 0; j < this.exploreResults.outdoor.values.length; j++) {
      if (this.exploreResults.outdoor.values[j].name === this.outdoorPlace) {
        this.locationData.lat = this.exploreResults.outdoor.values[j].lat;
        this.locationData.lng = this.exploreResults.outdoor.values[j].lng;
        if(this.exploreResults.outdoor.values[j].address !== undefined) {
          this.locationData.address = this.exploreResults.outdoor.values[j].address;
        }
      }
    }
    this.dialogRef.close({ type: 'outdoor', place: this.locationData });
  }

  submitShops() {
    this.locationData.name = this.shopsPlace;

    for (let j = 0; j < this.exploreResults.shops.values.length; j++) {
      if (this.exploreResults.shops.values[j].name === this.shopsPlace) {
        this.locationData.lat = this.exploreResults.shops.values[j].lat;
        this.locationData.lng = this.exploreResults.shops.values[j].lng;
        if(this.exploreResults.shops.values[j].address !== undefined) {
          this.locationData.address = this.exploreResults.shops.values[j].address;
        }
      }
    }
    this.dialogRef.close({ type: 'shops', place: this.locationData });
  }
}
