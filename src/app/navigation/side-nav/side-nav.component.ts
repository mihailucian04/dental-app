import { Component, OnInit, HostBinding } from '@angular/core';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {

  public expanded = false;
  public sidenavWidth = 4;

  constructor() { }

  ngOnInit() {
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
