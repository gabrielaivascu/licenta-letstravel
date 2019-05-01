import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { StartPlanService } from '../services/start-plan.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  destinations: string[] = ['Spain', 'Italy', 'Greece'];
  hasUpcomingTrip: boolean = false;
  formGroupTrip: FormGroup;

  constructor(public startPlanService: StartPlanService, public router: Router) { }

  ngOnInit() {
    this.formGroupTrip = new FormGroup({
      location : new FormControl(),
      startDate : new FormControl(),
      endDate : new FormControl()
    });
  }

  onSubmit(){
    // this.startPlanService.myMethod(this.formGroupTrip.value);
    this.startPlanService.setLocation(this.formGroupTrip.value);
    this.router.navigateByUrl('/add-plan');
  }
}
