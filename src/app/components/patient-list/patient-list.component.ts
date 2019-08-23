import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit, NgZone } from '@angular/core';
import { Patient, NewPatient } from 'src/app/models/patient.model';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { GoogleDataService } from 'src/app/services/google-data.service';
import { NewPatientComponent } from './new-patient/new-patient.component';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.scss']
})
export class PatientListComponent implements OnInit, AfterViewInit {

  public displayedColumns: string[] = ['avatar', 'surname', 'age', 'lastConsult', 'company', 'update'];
  public dataSource: any;
  public isLoaded = false;
  public newPatient: NewPatient = { firstName: '', lastName: '', phoneNumber: '', emailAddress: '', company: '', jobTitle: 'patient' };

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private router: Router,
              private googleDataService: GoogleDataService,
              private ngZone: NgZone,
              public dialog: MatDialog) { }

  ngOnInit() {
    this._getPatientList();
  }

  ngAfterViewInit() {
  }

  private _getPatientList() {
    this.ngZone.runOutsideAngular(() => {
      this.googleDataService.getContacts().then((patients: Patient[]) => {
        this.ngZone.run(() => {
          this.dataSource = new MatTableDataSource<Patient>();
          this.dataSource.data = patients;
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.isLoaded = true;
        });
      });
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  navigateTo(row: Patient) {
    this.router.navigate([`/patient-details/${row.resourceName}`]);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(NewPatientComponent, {
      // width: '250px',
      data: this.newPatient
    });

    dialogRef.afterClosed().subscribe(result => {
      this._getPatientList();
    });
  }

}
