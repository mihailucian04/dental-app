import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

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
        MatProgressSpinnerModule} from '@angular/material';
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
         faTrashAlt } from '@fortawesome/free-solid-svg-icons';

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
    LastConsultsComponent
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
    ChartsModule,
    OverlayModule
  ],
  exports: [
    MatToolbarModule,
    MatIconModule
  ],
  providers: [
    { provide: APP_INITIALIZER, useFactory: initGapi, deps: [AuthService], multi: true},
    FilePreviewOverlayService
  ],
  entryComponents: [
    FilePreviewOverlayComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  private icons = [faCoffee, faTachometerAlt, faUsers, faCalendarAlt, faCog, faAngleRight, faAngleLeft, faTooth, faUserCircle,
    faCalendarCheck, faIdCard, faFileImage, faEye, faDownload, faTrashAlt];

    constructor() {
    library.add(...this.icons);
    }

 }
