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
        MatSelectModule,
        MatCheckboxModule,
        MatRadioModule,
        MatAutocompleteModule} from '@angular/material';
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
         faBars,
         faFolderOpen,
         faNotesMedical,
         faUpload,
         faImages,
         faEllipsisV,
         faEdit,
         faUserAltSlash,
         faChevronUp,
         faChevronDown } from '@fortawesome/free-solid-svg-icons';

import { faClock as farClock } from '@fortawesome/free-regular-svg-icons';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './services/auth.service';
import { OverlayModule } from '@angular/cdk/overlay';
import { FilePreviewOverlayService } from './services/file-preview-overlay.service';
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
import { ToothDetailsComponent } from './components/patient-details/dental-map/tooth-details/tooth-details.component';
import { FilePreviewOverlayComponent } from './components/file-preview-overlay-toolbar/file-preview-overlay/file-preview-overlay.component';
import { NewConsultComponent } from './components/patient-details/last-consults/new-consult/new-consult.component';
import { DeleteXrayComponent } from './components/patient-details/x-rays/delete-xray/delete-xray.component';

import { ChartsModule } from 'ng2-charts';
import { EmcOptionsComponent } from './components/dashboard/emc-options/emc-options.component';
import { PatientFilesComponent } from './components/patient-details/patient-files/patient-files.component';
import { EditValueComponent } from './components/settings/edit-value/edit-value.component';
import { HttpClientModule } from '@angular/common/http';
import { EditPatientComponent } from './components/patient-list/edit-patient/edit-patient.component';
import { RemoveConfirmationComponent } from './components/patient-list/remove-confirmation/remove-confirmation.component';

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
    ToothDetailsComponent,
    NewConsultComponent,
    DeleteXrayComponent,
    EmcOptionsComponent,
    PatientFilesComponent,
    EditValueComponent,
    EditPatientComponent,
    RemoveConfirmationComponent,
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
    MatCheckboxModule,
    MatAutocompleteModule,
    OverlayModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MatRadioModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    FlatpickrModule.forRoot(),
    ChartsModule,
    HttpClientModule
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
    NewAppointmentComponent,
    ToothDetailsComponent,
    NewConsultComponent,
    DeleteXrayComponent,
    EmcOptionsComponent,
    EditValueComponent,
    EditPatientComponent,
    RemoveConfirmationComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  private icons = [faCoffee, faTachometerAlt, faUsers, faCalendarAlt, faCog, faAngleRight, faAngleLeft, faTooth, faUserCircle,
    faCalendarCheck, faIdCard, faFileImage, faEye, faDownload, faTrashAlt, faPlus, faBuilding, faPhoneAlt, faEnvelope, faPencilAlt,
    faClock, faBars, faFolderOpen, faNotesMedical, faUpload, faImages, faEllipsisV, faEdit, faUserAltSlash, faChevronUp, faChevronDown];

    constructor() {
    library.add(...this.icons);
    }

 }
