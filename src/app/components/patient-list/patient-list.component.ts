import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit, NgZone } from '@angular/core';
import { Patient } from 'src/app/models/patient.model';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { Router } from '@angular/router';
import { GoogleDataService } from 'src/app/services/google-data.service';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.scss']
})
export class PatientListComponent implements OnInit, AfterViewInit {

  public displayedColumns: string[] = ['avatar', 'surname', 'age', 'lastConsult', 'company', 'update'];
  public dataSource = new MatTableDataSource<Patient>();
  public isLoaded = false;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private router: Router,
              private googleDataService: GoogleDataService,
              private ngZone: NgZone) { }

  ngOnInit() {
    this._getPatientList();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  private _getPatientList() {
    this.ngZone.runOutsideAngular(() => {
      this.googleDataService.getContacts().then((patients: any) => {
        this.ngZone.run(() => {
          this.dataSource.data = patients;
          this.isLoaded = true;
        });
      });
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  navigateTo(row: Patient) {
    // localStorage.setItem(`patient-details${row.guid}`, JSON.stringify(row));
    this.router.navigate([`/patient-details/${row.resourceName}`]);
  }

}
