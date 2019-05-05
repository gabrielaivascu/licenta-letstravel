import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { StartPlanService } from '../services/start-plan.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { Location } from '@angular/common';
import { FirebaseService } from '../services/firebase.service';
import { AngularFireDatabase } from '@angular/fire/database';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  destinations: string[] = ['Spain', 'Italy', 'Greece'];
  hasUpcomingTrip: boolean = false;
  upcomingLocation: string = '';
  daysLeft: number;
  formGroupTrip: FormGroup;
  constructor(public startPlanService: StartPlanService, public router: Router, public firebaseService: FirebaseService,
    private location: Location, public userService: UserService, public authService: AuthService, private db: AngularFireDatabase) { }
  trips: any;

  ngOnInit() {

    let user = this.firebaseService.getCurrentUser();
    this.firebaseService.getTrips(user).subscribe(trip => {
      this.trips = trip;
      if (this.trips.length > 0) {
        this.hasUpcomingTrip = true;
      } else {
        this.hasUpcomingTrip = false;
      }
      console.log(this.trips);
      this.trips.forEach(trip => {
        let start = new Date(trip.startDate);
        let current = new Date();
        if (start > current) {
          this.upcomingLocation = trip.location;
          this.daysLeft = start.getDate() - current.getDate();
        }
      });
    });

    this.formGroupTrip = new FormGroup({
      location: new FormControl(),
      startDate: new FormControl(),
      endDate: new FormControl()
    });
  }

  onSubmit() {
    this.firebaseService.createTrip(this.formGroupTrip.value);
    this.startPlanService.setLocation(this.formGroupTrip.value);
    this.router.navigateByUrl('/add-plan');
  }

  logout() {
    this.authService.doLogout()
      .then((res) => {
        this.location.back();
      }, (error) => {
        console.log("Logout error", error);
      });
  }
}
