import { Injectable } from '@angular/core';

import { AngularFireDatabase } from '@angular/fire/database';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  trips: Observable<any[]>;
  plan: Observable<any[]>;
  constructor(private db: AngularFireDatabase) { }

  getCurrentUser() {
    if(firebase.auth().currentUser) {
      return firebase.auth().currentUser.uid;
    }
    return;
  }

  getTrips(userId: any) {
    this.trips = this.db.list('trips/' + userId).valueChanges() as Observable<any[]>;
    return this.trips;
  }

  getPlans(userId: any) {
    this.plan = this.db.list('plan/' + userId).valueChanges() as Observable<any[]>;
    return this.plan;
  }

  createTrip(data) {
    var newPostKey = firebase.database().ref().child('trips').push().key;
    let userId = firebase.auth().currentUser.uid;

    var updates = {};
    updates['/trips/' + userId + '/' + newPostKey] = {
        tripId: newPostKey,
        location: data.location,
        startDate: String(data.startDate),
        endDate: String(data.endDate),
        placeId: data.placeId
      };
    firebase.database().ref().update(updates);
    return newPostKey;
  }

  createPlan(data, tripId: any) {
    let userId = firebase.auth().currentUser.uid;
    let plan = this.db.list('/plan/' + userId);

    plan.push({
      events: data,
      tripId: tripId
    })
  }
}
