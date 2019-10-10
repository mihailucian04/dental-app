import { Component, OnInit, HostBinding } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { onSideNavChange, animateText } from 'src/app/animations/animations';
import { SidenavService } from 'src/app/services/sidenav.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
  animations: [onSideNavChange, animateText]
})
export class SideNavComponent implements OnInit {

  public sideNavState = false;
  public linkText = false;

  public expanded = false;
  public sidenavWidth = 4;

  public menuIconStyles: any = {
    color: '#595959',
    'margin-left': '5px'
  };

  constructor(private sidenavService: SidenavService) { }

  ngOnInit() {
  }

  public onSinenavToggle() {
    this.sideNavState = !this.sideNavState;
    setTimeout(() => {
      this.linkText = this.sideNavState;
    }, 200);

    this.sidenavService.sideNavState$.next(this.sideNavState);
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
