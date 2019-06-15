import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomepageComponent } from './homepage/homepage.component';
import { MatButtonModule } from '@angular/material/button';
import { HeaderComponent } from './components/header/header.component';
import { MatRippleModule } from '@angular/material/core';
import { CreateAccountComponent } from './create-account/create-account.component';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { environment } from '../environments/environment';
import { HttpClientModule } from '@angular/common/http';
import {
  MatAutocompleteModule,
  MatBadgeModule,
  MatBottomSheetModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatTreeModule,
} from '@angular/material';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UpcomingTripsComponent } from './upcoming-trips/upcoming-trips.component';
import { ButtonComponent } from './components/button/button.component';
import { AddPlanComponent } from './add-plan/add-plan.component';
import { PlannerComponent } from './planner/planner.component';
import { AuthService } from './services/auth.service';
import { UserResolver } from './services/user.resolver';
import { AuthGuard } from './guards/auth.guard';
import { UserService } from './services/user.service';
import { FirebaseService } from './services/firebase.service';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DialogComponent } from './planner/dialog/dialog.component';
import { AgmCoreModule } from '@agm/core';
import { MatGoogleMapsAutocompleteModule } from '@angular-material-extensions/google-maps-autocomplete';
import { TimelineComponent } from './timeline/timeline.component'; 
import { MglTimelineModule } from 'angular-mgl-timeline';
import { NavComponent } from './components/nav/nav.component';
import { PreviousTripComponent } from './previous-trip/previous-trip.component';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    HeaderComponent,
    CreateAccountComponent,
    LoginComponent,
    DashboardComponent,
    UpcomingTripsComponent,
    ButtonComponent,
    AddPlanComponent,
    PlannerComponent,
    DialogComponent,
    TimelineComponent,
    NavComponent,
    PreviousTripComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    HttpClientModule,
    DragDropModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAGjPKxEo7Jy5BsHwdrgA5lPzHC3eHAxtE',
      libraries: ['places', 'geometry'],
      language: 'en'
    }),
    MatGoogleMapsAutocompleteModule.forRoot(),
    MglTimelineModule
    
  ],
  entryComponents: [DialogComponent],
  providers: [AuthService, UserService, UserResolver, AuthGuard, FirebaseService],
  bootstrap: [AppComponent]
})
export class AppModule { }
