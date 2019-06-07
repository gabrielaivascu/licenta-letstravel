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
    this.data.next(data);
  }

}
