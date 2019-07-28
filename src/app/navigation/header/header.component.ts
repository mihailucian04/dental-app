import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public isLoggedIn$: Observable<boolean>;
  public username$: Observable<string>;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.isLoggedIn$ = this.authService.isLoggedIn;
    this.username$ = this.authService.userName;
  }

  public signOut() {
    this.authService.signOut();
  }

}
