import { Component, OnInit, AfterViewInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { StartPlanService } from '../services/start-plan.service';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
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

  lat: number = 39.46005809999999;
  lng: number = -0.3495368999999755
  zoom: number = 12;

  locationList: any = [];
  public origin: any;
public destination: any;

  constructor(public startPlanService: StartPlanService, public userService: UserService,
    public authService: AuthService, private location: Location, public router: Router,
    public firebaseService: FirebaseService) { }

  ngOnInit() {

    this.startPlanService.currentData.subscribe(data => {
      this.data = data.value;
      this.key = data.key;
      let day = 1000 * 60 * 60 * 24;
      this.days = Math.round((this.data.endDate.getTime() - this.data.startDate.getTime()) / day) + 1;
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

  coords: any = [];
  waypoints: any = [];

  addEvents(e: any) {
    let coordsDay : any =[];
    this.allEvents[e.index] = {events: e.events};
    this.allEvents[e.index].events.forEach(event => {
      if(event.coord) {
        coordsDay.push(event.coord);
      }
    });
    if(coordsDay.length > 1) {
      let copyCoords = coordsDay.slice(1,coordsDay.length - 1);
      let copyArray = [];
      copyCoords.forEach(coord => {
        copyArray.push({location: coord});
      })

      this.waypoints[e.index] = copyArray;
    }

    this.coords[e.index] = coordsDay;
    console.log(this.waypoints);
    console.log(this.coords);
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
    this.locationList.push(result);
  }


  savePlan() {
    console.log(this.allEvents);
    this.firebaseService.createPlan(this.allEvents, this.key);
    this.router.navigate(['/timeline', this.key]);
  }
}
