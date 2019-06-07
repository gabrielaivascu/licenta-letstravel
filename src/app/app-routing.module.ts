import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddPlanComponent } from './add-plan/add-plan.component';
import { AuthGuard } from './guards/auth.guard';
import { UserResolver } from './services/user.resolver';
import { TimelineComponent } from './timeline/timeline.component';

const routes: Routes = [
  { path: '', redirectTo: '/homepage', pathMatch: 'full' },
  { path: 'homepage', component: HomepageComponent, canActivate: [AuthGuard] },
  { path: 'create-account', component: CreateAccountComponent, canActivate: [AuthGuard]},
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardComponent, resolve: { data: UserResolver }},
  { path: 'add-plan', component: AddPlanComponent },
  { path: 'timeline/:plan', component: TimelineComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
