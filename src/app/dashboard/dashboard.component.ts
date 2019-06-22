import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StartPlanService } from '../services/start-plan.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { FirebaseService } from '../services/firebase.service';

import { Location } from '@angular-material-extensions/google-maps-autocomplete';
import PlaceResult = google.maps.places.PlaceResult;
import { AgmCoreModule } from '@agm/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  destinations: string[] = ['Barcelona', 'Rome', 'Antalya'];
  destination: string = '';
  hasUpcomingTrip: boolean = false;
  upcomingLocation: string = '';
  daysLeft: number;
  formGroupTrip: FormGroup;
  trips: any;
  location: any;
  latitude: number;
  longitude: number;
  photosPlace = new Map();
  upcomingTrips: any = [];
  prevTrips: any = [];

  constructor(
    public startPlanService: StartPlanService,
    public router: Router,
    public firebaseService: FirebaseService,
    public userService: UserService,
    public authService: AuthService) { 
    }
    

  ngOnInit() {
    let user = this.firebaseService.getCurrentUser();
    this.firebaseService.getTrips(user).subscribe(trip => {
      this.trips = trip;

      this.trips.forEach(trip => {
        let start = new Date(trip.startDate);
        let current = new Date();
        if (!this.photosPlace.get(trip.placeId)) {
          this.retrievePhotoUrlsFromPlaceId(trip.placeId);
        }
        if (start > current) {
          this.upcomingTrips.push(trip);
        } else {
          this.prevTrips.push(trip);
        }
      });
    });

    this.formGroupTrip = new FormGroup({
      location: new FormControl('', [Validators.required]),
      startDate: new FormControl('', [Validators.required]),
      endDate: new FormControl('', [Validators.required]),
      coord: new FormControl(),
      placeId: new FormControl()
    });
  }

  onLocationSelected(location: Location) {
    this.formGroupTrip.patchValue({ coord: location });
  }

  onAutocompleteSelected(result: PlaceResult) {
    this.formGroupTrip.patchValue({ location: result.name });
    this.formGroupTrip.patchValue({
      placeId: result.place_id
    });
  }


  retrievePhotoUrlsFromPlaceId(placeId) {
    if (!this.photosPlace.get(placeId)) {
      let lat = 24.799448;
      let lng = 120.979021;
      let map = new google.maps.Map(document.getElementById('map'),
        {  zoom: 4,
          center: {lat: -33, lng: 151}
        });

      let service = new google.maps.places.PlacesService(map);
      service.getDetails(
        {
          placeId: placeId
        }, (placeResult, status) => {
          if (status == google.maps.places.PlacesServiceStatus.OK) {
            this.photosPlace.set(placeId, placeResult.photos[3].getUrl({
              maxWidth: 500,
              maxHeight: undefined
            }));
          }
        }
      );
    }
  }

  numberOfDaysLeft(startDate: any) {
    let start = new Date(startDate);
    let current = new Date();
    let day = 1000 * 60 * 60 * 24;
    return (Math.round(((start.getTime() - current.getTime()) / day) + 1));
  }

  daysTrip(startDate: any, endDate: any) {
    let start = new Date(startDate);
    let end = new Date(endDate);
    let day = 1000 * 60 * 60 * 24;
    return (Math.round((end.getTime() - start.getTime()) / day) + 1);
  }

  onSubmit() {
    let tripKey = this.firebaseService.createTrip(this.formGroupTrip.value);
    this.startPlanService.setLocation({ value: this.formGroupTrip.value, key: tripKey });
    this.router.navigateByUrl('/add-plan');
  }

  logout() {
    this.authService.doLogout()
      .then((res) => {
        this.router.navigateByUrl('/homepage');
      }, (error) => {
        console.log("Logout error", error);
      });
  }
}
