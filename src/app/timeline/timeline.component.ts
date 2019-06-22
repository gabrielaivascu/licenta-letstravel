import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import * as firebase from 'firebase/app';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';

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
            this.getDistances(self.events);
            this.showTimeline = true;
          }
        });
      });
    });
  }

  getPrice(tier: number) {
    if (tier === 1) {
      return '< $10'
    }
    if (tier === 2) {
      return '$10 - $20'
    }
    if (tier === 3) {
      return '$20 - $30'
    }
    if (tier === 3) {
      return '> $30'
    }
  }

  getDistances(events: any) {
    events.forEach((day) => {
      let indexRoutes = 0;
      if (day.events.length > 0) {
   
        for (let i = 1; i < day.events.length; i++) {
          if (day.events[i - 1].coord !== undefined && day.events[i].coord !== undefined) {
              day.events.splice(i, 0, { content: Object(day.routes[indexRoutes]), type: 'distance' });
              indexRoutes++;
          }
        }
      }
    })
  }

  getIcon(type: string) {
  
    if (type === 'flight') {
      return 'flight';
    }
    if (type === 'food') {
      return 'restaurant';
    }
    if (type === 'outdoor') {
      return 'location_city';
    }
    if (type === 'shops') {
      return 'shopping_basket';
    }
    if (type === 'other') {
      return 'schedule';
    }
    if (type === 'hotel') {
      return 'hotel';
    }
    if (type === 'WALKING') {
      return 'directions_walk';
    }
    if (type === 'DRIVING') {
      return 'directions_car';
    }
    if (type === 'BICYCLING') {
      return 'directions_bike';
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
