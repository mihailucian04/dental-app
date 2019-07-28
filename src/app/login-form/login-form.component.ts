import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { SnackBarService } from '../services/snack-bar.service';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';


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
              private authService: AuthService) { }

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
    this.authService.signIn().then(() => {
      this.authService.getToken();
      this.router.navigate(['/dashboard']);
    });

    localStorage.setItem('test1', 'authenticated');
  }
}
