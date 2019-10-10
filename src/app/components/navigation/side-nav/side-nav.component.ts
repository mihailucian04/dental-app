import { Component, OnInit, HostBinding } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {

  public isLoggedIn$: Observable<boolean>;
  public loggedIn = false;
  public expanded = false;
  public sidenavWidth = 4;

  public menuIconStyles: any = {
    color: '#595959',
    'margin-left': '5px'
  };

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.isLoggedIn$ = this.authService.isLoggedIn;

    this.authService.isLoggedIn.subscribe(status => {
      this.loggedIn = status;
    });
  }

  public increase() {
    this.sidenavWidth = 12;
    this.expanded = true;
    console.log('increase sidenav width');
  }

  public decrease() {
    this.sidenavWidth = 4;
    this.expanded = false;
    console.log('decrease sidenav width');
  }

}
