import { Component, OnInit, Input, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { AuthService } from 'src/app/services/auth.service';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';


@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

  public initDriveData$: Observable<boolean>;

  constructor(private router: Router,
              private authService: AuthService,
              private ngZone: NgZone) { }

  ngOnInit() {
    this.initDriveData$ = this.authService.initDrive;
  }

  public signIn() {
    this.ngZone.runOutsideAngular(() => {
      this.authService.signIn();
    });
    this.authService.isLoggedIn.pipe(filter(k => {
      return k;
    }), take(1)).subscribe(() => {
      this.ngZone.run(() => {
        this.router.navigate(['/dashboard']);
      });
    });
  }
}
