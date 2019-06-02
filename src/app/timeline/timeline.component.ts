import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';
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
  size: number = 40;
  expandEnabled: boolean = true;
  side = 'left';
  plans: any;
  events: any;
  showTimeline:boolean = false;

  entries = [
    {
      header: 'header',
      content: 'content'
    }
  ]

  constructor(public firebaseService: FirebaseService,public authService: AuthService, public router: Router) { }

  ngOnInit() {
    let self = this;
    firebase.auth().onAuthStateChanged( (user) => {

      self.firebaseService.getPlans(user.uid).subscribe(plan => {
        self.plans = plan;
        console.log(plan);
  
        self.plans.forEach(plan => {
          self.events = Object(plan).events;
          this.showTimeline = true;
        });
      });
    });
  }

  getIcon(type:string) {
    if(type==='flight') {
      return 'flight';
    } 
    if(type==='food') {
      return 'restaurant';
    } 
    if(type==='outdoor') {
      return 'location_city';
    } 
    if(type==='shops') {
      return 'shopping_basket';
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
