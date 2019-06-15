import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import * as firebase from 'firebase/app';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';

import { AgmCoreModule } from '@agm/core';


@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {

  alternate: boolean = true;
  toggle: boolean = true;
  color: boolean = true;
  size: number = 20;
  expandEnabled: boolean = false;
  side = 'left';
  plans: any;
  events: any;
  showTimeline: boolean = false;

  entries = [
    {
      header: 'header',
      content: 'content'
    }
  ]

  constructor(
    public firebaseService: FirebaseService,
    public authService: AuthService,
    public router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    let self = this;
    let tripKey = this.route.snapshot.paramMap.get("plan");

    firebase.auth().onAuthStateChanged((user) => {

      self.firebaseService.getPlans(user.uid).subscribe(plans => {
        self.plans = plans;

        self.plans.forEach(plan => {
          if (plan.tripId === tripKey) {
            self.events = Object(plan).events;
            // console.log(self.events);
            this.getDistances(self.events);
            this.showTimeline = true;
          }
        });
      });
    });
  }

  getDistances(events: any) {
    // console.log(events);
    events.forEach((day) => {
      if(day.events.length > 0) {
        for (let i = 1; i < day.events.length; i++) {
          if(day.events[i-1].coord !== undefined && day.events[i].coord !== undefined) {

            let distResult = this.getDistanceBetweenTwo(day.events[i-1].coord, day.events[i].coord);
            if(distResult !== null) {
              day.events.splice(i, 0, {content: distResult, type: 'distance'});
              i++;
              console.log(day.events);
              // this.getEstimation(distResult);
            }
          }
        }
      }
    })
  }

  getDistanceBetweenTwo(coord1: any, coord2: any){
    let dist1 = new google.maps.LatLng(coord1.lat, coord1.lng);
    let dist2 = new google.maps.LatLng(coord2.lat, coord2.lng);

    let distance = google.maps.geometry.spherical.computeDistanceBetween(dist1, dist2);
    console.log(distance/1000 + ' km');
    if(distance !== NaN) {
      return +(distance/1000).toFixed(2);
    } else {
      return null;
    }
  }

  getEstimation(km: number, type: string) {
    if(type === 'walk') {
      let walking = (60 * km)/ 4.6;
      console.log(Math.round(walking));
      return Math.round(walking);
    }
    if(type === 'drive') {
      let driving = (60 * km)/ 60;
      console.log(Math.round(driving));
      return Math.round(driving);
    }
  }

  getIcon(type: string) {
    // console.log(type);
    if (type === 'flight') {
      return 'flight';
    }
    if (type === 'food') {
      return 'restaurant';
    }
    if (type === 'outdoor') {
      return 'location_city';
    }
    if (type === 'shop') {
      return 'shopping_basket';
    }
    if (type === 'other') {
      return 'schedule';
    }
    if (type === 'hotel') {
      return 'hotel';
    }
    if (type === 'distance') {
      return 'navigation';
    }
  }

  addEntry() {
    this.entries.push({
      header: 'header',
      content: 'content'
    })
  }

  removeEntry() {
    this.entries.pop();
  }

  onHeaderClick(event) {
    if (!this.expandEnabled) {
      event.stopPropagation();
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

  onDotClick(event) {
    if (!this.expandEnabled) {
      event.stopPropagation();
    }
  }

  onExpandEntry(expanded, index) {
    console.log(`Expand status of entry #${index} changed to ${expanded}`)
  }

  toggleSide() {
    this.side = this.side === 'left' ? 'right' : 'left';
  }
}
