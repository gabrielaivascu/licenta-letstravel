import { Component, OnInit, AfterViewInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { StartPlanService } from '../services/start-plan.service';

@Component({
  selector: 'app-add-plan',
  templateUrl: './add-plan.component.html',
  styleUrls: ['./add-plan.component.scss']
})
export class AddPlanComponent implements OnInit {
  data: any;
  days: number;
  tabs: any[] = [];

  constructor(public startPlanService: StartPlanService) { }

  ngOnInit() {
    this.startPlanService.currentData.subscribe(data => {
      this.data = data;
      this.days = (this.data.endDate - this.data.startDate) / 1000 / 60 / 60 / 24;
      console.log(this.days);
      for (let i = 0; i < this.days; i++) {
        this.tabs.push('Day ' + (i + 1));
      }
      console.log(this.tabs);
    })
  }
}
