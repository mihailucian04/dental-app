import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';
import { SidenavService } from './services/sidenav.service';
import { onMainContentChange } from './animations/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [ onMainContentChange ]
})
export class AppComponent {
  public isLoggedIn$: Observable<boolean>;
  public onSideNavChange: boolean;
  title = 'dental-app';

  constructor(private authService: AuthService,
              private sidenavService: SidenavService) {
    this.isLoggedIn$ = this.authService.isLoggedIn;
    this.sidenavService.sideNavState$.subscribe(res => {
      this.onSideNavChange = res;
    });
  }
}
