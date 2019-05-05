import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireDatabase } from '@angular/fire/database';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  trips: Observable<any[]>;
  constructor(private firestore: AngularFirestore, private db: AngularFireDatabase) { }

  getCurrentUser() {
    return firebase.auth().currentUser.uid;
  }

  getTrips(userId: any) {
    this.trips = this.db.list('trips/' + userId).valueChanges() as Observable<any[]>;
    return this.trips;
  }

  createTrip(data) {
    let userId = firebase.auth().currentUser.uid;
    let trips = this.db.list('/trips/' + userId);
    trips.push({
      location: data.location,
      startDate: String(data.startDate),
      endDate: String(data.endDate)
    })
    // firebase.database().ref('trips/' + userId).set({
    //   location: data.location,
    //   startDate: String(data.startDate),
    //   endDate: String(data.endDate)
    // });
  }
}
