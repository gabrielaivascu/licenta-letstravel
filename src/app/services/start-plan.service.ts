import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StartPlanService {

  private data = new BehaviorSubject({value: '', key: ''});

  currentData = this.data.asObservable();

  constructor() { }

  setLocation(data: any) {
    console.log(data);
    this.data.next(data);
  }

}
