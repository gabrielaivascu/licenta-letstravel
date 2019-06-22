import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class AddPlanComponent implements OnInit {
  data: any;
  key: any;
  days: number;
  tabs: any[] = [];
  selectedIndex = 0;
  travelMode: String = 'DRIVING';
  // travelMode: String = 'WALKING';
  totalTime: any;
  allEvents: any = [];
  activeIndex: any;

  lat: number = 39.46005809999999;
  lng: number = -0.3495368999999755
  zoom: number = 12;

  locationList: any = [];

  constructor(public startPlanService: StartPlanService, public userService: UserService,
    public authService: AuthService, private location: Location, public router: Router,
    public firebaseService: FirebaseService) { }

  ngOnInit() {

    this.startPlanService.currentData.subscribe(data => {
      this.data = data.value;
      this.key = data.key;
      let day = 1000 * 60 * 60 * 24;
      if (this.data.endDate && this.data.startDate) {
        this.days = Math.round((this.data.endDate.getTime() - this.data.startDate.getTime()) / day) + 1;
      }
      for (let i = 0; i < this.days; i++) {
        this.tabs.push('Day ' + (i + 1));
      }

      if (this.data.location) {
        // localStorage.setItem('location', this.data.location);
        this.lat = this.data.coord.latitude;
        this.lng = this.data.coord.longitude;
      }
    });
  }

  // ngOnDestroy() {
  //   localStorage.setItem('location', '');
  // }

  coords: any = [];
  waypoints: any = [];

  addEvents(e: any) {
    let coordsDay: any = [];
    this.allEvents[e.index] = { events: e.events };
    this.activeIndex = e.index;

    //make coords for direction
    this.allEvents[e.index].events.forEach(event => {
      if (event.coord) {
        coordsDay.push(event.coord);
      }
    });
    if (coordsDay.length > 1) {
      let copyCoords = coordsDay.slice(1, coordsDay.length - 1);
      let copyArray = [];
      copyCoords.forEach(coord => {
        copyArray.push({ location: coord });
      })

      this.waypoints[e.index] = copyArray;
    }

    this.coords[e.index] = coordsDay;
  }

  changed(e: any) {
    this.selectedIndex = e.selectedIndex;
  }

  public onResponse(event: any) {
    let dayRoutes: any = [];
    this.totalTime = 0;
    if(event.routes.length > 0) {
      event.routes[0].legs.forEach(route => {
        this.totalTime += route.duration.value;
        dayRoutes.push({distance: route.distance.text, duration: route.duration.text, mode: this.travelMode});
      });

      this.totalTime = Math.round(this.totalTime / 60);
      this.allEvents[this.activeIndex].routes = dayRoutes;
    }
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
    this.firebaseService.createPlan(this.allEvents, this.key);
    this.router.navigate(['/timeline', this.key]);
  }
}
