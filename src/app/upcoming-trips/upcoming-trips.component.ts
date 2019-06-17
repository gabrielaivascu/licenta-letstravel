import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upcoming-trips',
  templateUrl: './upcoming-trips.component.html',
  styleUrls: ['./upcoming-trips.component.scss']
})
export class UpcomingTripsComponent implements OnInit {
  upcomingTrips: any = [];
  trips: any;

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
        if (start > current) {
          this.upcomingTrips.push(trip);
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
}
