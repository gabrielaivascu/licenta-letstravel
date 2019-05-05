import { Component, OnInit, AfterViewInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { StartPlanService } from '../services/start-plan.service';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-add-plan',
  templateUrl: './add-plan.component.html',
  styleUrls: ['./add-plan.component.scss']
})
export class AddPlanComponent implements OnInit {
  data: any;
  days: number;
  tabs: any[] = [];

  constructor(public startPlanService: StartPlanService, public userService: UserService,
    public authService: AuthService, private location: Location) { }

  ngOnInit() {
    this.startPlanService.currentData.subscribe(data => {
      this.data = data;
      this.days = this.data.endDate.getDate() - this.data.startDate.getDate();
      for (let i = 0; i < this.days; i++) {
        this.tabs.push('Day ' + (i + 1));
      }
    })
  }
  logout() {
    this.authService.doLogout()
      .then((res) => {
        this.location.back();
      }, (error) => {
        console.log("Logout error", error);
      });
  }
}
