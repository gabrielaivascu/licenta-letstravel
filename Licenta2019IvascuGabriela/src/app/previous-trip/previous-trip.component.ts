import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-previous-trip',
  templateUrl: './previous-trip.component.html',
  styleUrls: ['./previous-trip.component.scss']
})
export class PreviousTripComponent implements OnInit {

  prevTrips: any = [];
  trips: any;
  photosPlace = new Map();

  constructor(
    public firebaseService: FirebaseService,
    public userService: UserService,
    public authService: AuthService,
    public router: Router) { }

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
        if (start < current) {
          this.prevTrips.push(trip);
        }
      });
    });
  
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

  logout() {
    this.authService.doLogout()
      .then((res) => {
        this.router.navigateByUrl('/homepage');
      }, (error) => {
        console.log("Logout error", error);
      });
  }
 
  retrievePhotoUrlsFromPlaceId(placeId) {
    if (!this.photosPlace.get(placeId)) {
      let lat = 24.799448;
      let lng = 120.979021;
      let map = new google.maps.Map(document.getElementById('map'),
        { center: { lat: lat, lng: lng}, zoom: 13 });

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
}
