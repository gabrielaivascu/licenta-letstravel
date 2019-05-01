import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor( private firestore: AngularFirestore  ) { }

  createTrip(data) {
    return new Promise<any>((resolve, reject) =>{
      this.firestore
          .collection("trips")
          .add({
            location: data.location,
            startDate: data.startDate,
            endDate: data.endDate
          })
          .then(res => {}, err => reject(err));
  });
  }
}
