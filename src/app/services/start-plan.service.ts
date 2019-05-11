import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StartPlanService {

  private data = new BehaviorSubject('');
  currentData = this.data.asObservable();

  constructor() { }

  setLocation(data: string) {
    this.data.next(data)
  }

}