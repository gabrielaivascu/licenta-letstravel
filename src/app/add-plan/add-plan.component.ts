import { Component, OnInit, AfterViewInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { StartPlanService } from '../services/start-plan.service';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { PlacesService } from '../services/places.service';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-add-plan',
  templateUrl: './add-plan.component.html',
  styleUrls: ['./add-plan.component.scss']
})
export class AddPlanComponent implements OnInit, OnDestroy {
  data: any;
  key: any;
  days: number;
  tabs: any[] = [];
  selectedIndex = 0;

  allEvents: any = [];

  lat: number = 52.520008;
  lng: number = 13.404954;
  zoom: number = 12;

  locationList: [{ lat: number, lng: number }] = [{ lat: 0, lng: 0 }];

  constructor(public startPlanService: StartPlanService, public userService: UserService,
    public authService: AuthService, private location: Location, public router: Router,
    private placesService: PlacesService, public firebaseService: FirebaseService) { }

  ngOnInit() {
    this.startPlanService.currentData.subscribe(data => {
      this.data = data.value;
      this.key = data.key;

      this.days = (this.data.endDate.getDate() - this.data.startDate.getDate()) + 1;
      for (let i = 0; i < this.days; i++) {
        this.tabs.push('Day ' + (i + 1));
      }

      if (localStorage.getItem('location') != this.data.location && this.data.location) {
        localStorage.setItem('location', this.data.location);
        this.lat = this.data.coord.latitude;
        this.lng = this.data.coord.longitude;
      }
    });
  }

  ngOnDestroy() {
    localStorage.setItem('location', '');
  }

  addEvents(e: any) {
    this.allEvents[e.index] = {events: e.events, type: e.type};
    // this.allEvents[e.index].events = e.events;
    // this.allEvents[e.index].type = e.type;
  }

  changed(e: any) {
    this.selectedIndex = e.selectedIndex;
  }

  logout() {
    this.authService.doLogout()
      .then((res) => {
        this.router.navigateByUrl('/homepage');
      }, (error) => {
        console.log("Logout error", error);
      });
  }

  addMarker(result) {
    console.log(result);
    this.locationList.push(result);
  }


  savePlan() {
    console.log("save plan");
    console.log(this.allEvents);
    this.firebaseService.createPlan(this.allEvents, this.key);
    this.router.navigateByUrl('/timeline');
  }
}
