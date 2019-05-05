import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireDatabase } from'@angular/fire/database';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor( private firestore: AngularFirestore, private db: AngularFireDatabase) { }

  createTrip(data) {
    let trips = this.db.list('/trips');
    let uid = firebase.auth().currentUser.uid;
    let tripData = {
      user_uid: uid,
      location: data.location,
      startDate: String(data.startDate),
      endDate: String(data.endDate)
    };
    trips.push(tripData);

  }
}
