import { Component, OnInit, Input, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

  @Input()
  public email: string;
  @Input()
  public password: string;

  constructor(private router: Router,
              private snackBarSerice: SnackBarService,
              private authService: AuthService,
              private ngZone: NgZone) { }

  ngOnInit() {
  }

  public login() {
    if (this.email !== 'mihai.lucian04@gmail.com') {
      this.snackBarSerice.show('Wrong username');
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  public signIn() {
    this.ngZone.runOutsideAngular(() => {
      this.authService.signIn().then(() => {
        this.ngZone.run(() => {
          this.router.navigate(['/dashboard']);
        });
      });
    });
  }
}
