import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

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
        MatGridListModule  } from '@angular/material';
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
         faTooth } from '@fortawesome/free-solid-svg-icons';
import { LoginFormComponent } from './login-form/login-form.component';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { PatientListComponent } from './views/patient-list/patient-list.component';
import { SettingsComponent } from './views/settings/settings.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SideNavComponent,
    LoginFormComponent,
    DashboardComponent,
    PatientListComponent,
    SettingsComponent
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
    MatGridListModule
  ],
  exports: [
    MatToolbarModule,
    MatIconModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    library.add(faCoffee);
    library.add(faTachometerAlt);
    library.add(faUsers);
    library.add(faCalendarAlt);
    library.add(faCog);
    library.add(faAngleRight);
    library.add(faAngleLeft);
    library.add(faTooth);
   }
 }
