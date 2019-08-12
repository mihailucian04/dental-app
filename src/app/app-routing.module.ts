import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PatientListComponent } from './components/patient-list/patient-list.component';
import { PatientDetailsComponent } from './components/patient-details/patient-details.component';
import { SettingsComponent } from './components/settings/settings.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { CalendarComponent } from './components/calendar/calendar.component';


const routes: Routes = [ { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
                         { path: 'patient-list', component: PatientListComponent, canActivate: [AuthGuard] },
                         { path: 'patient-details/:id', component: PatientDetailsComponent, canActivate: [AuthGuard] },
                         { path: 'calendar', component: CalendarComponent, canActivate: [AuthGuard] },
                         { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
                         { path: 'login', component: LoginFormComponent },
                         { path: '**', component: LoginFormComponent } ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
