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
import { HeaderComponent } from './navigation/header/header.component';
import { SideNavComponent } from './navigation/side-nav/side-nav.component';

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
import { LoginFormComponent } from './login-form/login-form.component';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { PatientListComponent } from './views/patient-list/patient-list.component';
import { SettingsComponent } from './views/settings/settings.component';
import { AuthService } from './services/auth.service';
import { ChartsModule } from 'ng2-charts';
import { PatientDetailsComponent } from './views/patient-details/patient-details.component';

import { OverlayModule } from '@angular/cdk/overlay';
import { FilePreviewOverlayToolbarComponent } from './views/file-preview-overlay-toolbar/file-preview-overlay-toolbar.component';
import { FilePreviewOverlayService } from './services/file-preview-overlay.service';
import { FilePreviewOverlayComponent } from './services/file-preview-overlay.component';

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
    FilePreviewOverlayToolbarComponent
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
