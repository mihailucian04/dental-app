import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { PatientListComponent } from './views/patient-list/patient-list.component';
import { SettingsComponent } from './views/settings/settings.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [ { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
                         { path: 'patient-list', component: PatientListComponent, canActivate: [AuthGuard] },
                         { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
                         { path: 'login', component: LoginFormComponent },
                         { path: '**', component: LoginFormComponent } ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
