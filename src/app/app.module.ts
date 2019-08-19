import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import 'flatpickr/dist/flatpickr.css';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule,
        MatToolbarModule,
        MatIconModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatListModule,
        MatSidenavModule,
        MatTableModule,
        MatSnackBarModule,
        MatGridListModule,
        MatSortModule,
        MatPaginatorModule,
        MatTabsModule,
        MatProgressSpinnerModule,
        MatDialogModule,
        MatTooltipModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatSelectModule} from '@angular/material';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCoffee,
         faTachometerAlt,
         faUsers,
         faCalendarAlt,
         faCog,
         faAngleRight,
         faAngleLeft,
         faTooth,
         faUserCircle,
         faCalendarCheck,
         faIdCard,
         faFileImage,
         faEye,
         faDownload,
         faTrashAlt,
         faPlus,
         faBuilding,
         faPhoneAlt,
         faEnvelope,
         faPencilAlt,
         faClock,
         faBars } from '@fortawesome/free-solid-svg-icons';

import { faClock as farClock } from '@fortawesome/free-regular-svg-icons';

import { FormsModule } from '@angular/forms';
import { AuthService } from './services/auth.service';
import { ChartsModule } from 'ng2-charts';
import { OverlayModule } from '@angular/cdk/overlay';
import { FilePreviewOverlayService } from './services/file-preview-overlay.service';
import { FilePreviewOverlayComponent } from './services/file-preview-overlay.component';
import { HeaderComponent } from './components/navigation/header/header.component';
import { SideNavComponent } from './components/navigation/side-nav/side-nav.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PatientListComponent } from './components/patient-list/patient-list.component';
import { SettingsComponent } from './components/settings/settings.component';
import { PatientDetailsComponent } from './components/patient-details/patient-details.component';
import { FilePreviewOverlayToolbarComponent } from './components/file-preview-overlay-toolbar/file-preview-overlay-toolbar.component';
import { XRaysComponent } from './components/patient-details/x-rays/x-rays.component';
import { LastConsultsComponent } from './components/patient-details/last-consults/last-consults.component';
import { DentalMapComponent } from './components/patient-details/dental-map/dental-map.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FlatpickrModule } from 'angularx-flatpickr';
import { NewPatientComponent } from './components/patient-list/new-patient/new-patient.component';
import { DeleteConfirmationComponent } from './components/calendar/delete-confirmation/delete-confirmation.component';
import { NewAppointmentComponent } from './components/calendar/new-appointment/new-appointment.component';
import { DatePipe } from '@angular/common';
import {FlexLayoutModule} from '@angular/flex-layout';
export function initGapi(authService: AuthService) {
  return () => authService.initClient();
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SideNavComponent,
    LoginFormComponent,
    DashboardComponent,
    PatientListComponent,
    SettingsComponent,
    PatientDetailsComponent,
    FilePreviewOverlayComponent,
    FilePreviewOverlayToolbarComponent,
    XRaysComponent,
    LastConsultsComponent,
    DentalMapComponent,
    CalendarComponent,
    NewPatientComponent,
    DeleteConfirmationComponent,
    NewAppointmentComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    FontAwesomeModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatListModule,
    MatSidenavModule,
    MatTableModule,
    MatSnackBarModule,
    MatGridListModule,
    MatSortModule,
    MatPaginatorModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    ChartsModule,
    OverlayModule,
    FlexLayoutModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    FlatpickrModule.forRoot()
  ],
  exports: [
    MatToolbarModule,
    MatIconModule
  ],
  providers: [
    { provide: APP_INITIALIZER, useFactory: initGapi, deps: [AuthService], multi: true},
    FilePreviewOverlayService,
    DatePipe
  ],
  entryComponents: [
    FilePreviewOverlayComponent,
    NewPatientComponent,
    DeleteConfirmationComponent,
    NewAppointmentComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  private icons = [faCoffee, faTachometerAlt, faUsers, faCalendarAlt, faCog, faAngleRight, faAngleLeft, faTooth, faUserCircle,
    faCalendarCheck, faIdCard, faFileImage, faEye, faDownload, faTrashAlt, faPlus, faBuilding, faPhoneAlt, faEnvelope, faPencilAlt,
    faClock, faBars];

    constructor() {
    library.add(...this.icons);
    }

 }
