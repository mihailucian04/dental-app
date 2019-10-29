import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit, NgZone } from '@angular/core';
import { Patient, NewPatient } from 'src/app/models/patient.model';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { NewPatientComponent } from './new-patient/new-patient.component';
import { ContactsService } from 'src/app/services/contacts.service';
import { EditPatientComponent } from './edit-patient/edit-patient.component';

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

  public displayedColumns: string[] = [ 'select', 'avatar', 'surname', 'age', 'lastConsult', 'company', 'phone', 'edit'];
  public dataSource: any;
  public isLoaded = false;
  public newPatient: NewPatient = { firstName: '', lastName: '', phoneNumber: '', emailAddress: '', company: '', jobTitle: 'patient' };

  public masterCheck = false;
  public masterCheckVisible = false;
  public masterCheckIndeterminate = false;

  public patients: any;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private router: Router,
              private contactsService: ContactsService,
              private ngZone: NgZone,
              public dialog: MatDialog) { }

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      this.contactsService.getPatients('contactGroups/129398e00fdd68f5').then((patients) => {
        this.ngZone.run(() => {
          this.patients = patients;
          this.addShowEditProp();

          this.dataSource = new MatTableDataSource<Patient>();
          this.dataSource.data = this.patients;
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;

          this.isLoaded = true;
        });
      });
    });
  }

  ngAfterViewInit() {
  }

  private _getPatientList() {
    this.ngZone.runOutsideAngular(() => {
      this.contactsService.getPatients('contactGroups/129398e00fdd68f5').then((patients) => {
        this.ngZone.run(() => {
          this.dataSource = new MatTableDataSource<Patient>();
          this.dataSource.data = patients;
          this.dataSource.sort = this.sort;


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

  checkRow(e, row) {
    if (!row.checked) {
      this.masterCheckVisible = true;
      this.masterCheckIndeterminate = true;
    }
    e.stopPropagation();
    console.log(row);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(NewPatientComponent, {
      data: this.newPatient
    });

    dialogRef.afterClosed().subscribe(result => {
      this._getPatientList();
    });
  }

  handleMouseOver(row) {
    const resourceName = row.resourceName;
    this.patients.map((data: any) => {
      if (data.resourceName === resourceName) {
        data.showEdit = true;
      }
    });
  }

  handleMouseLeave(row) {
    const resourceName = row.resourceName;
    this.patients.map((data: any) => {
      if (data.resourceName === resourceName) {
        data.showEdit = false;
      }
    });
  }

  editPatient(e, row) {
    const dialogRef = this.dialog.open(EditPatientComponent, {
      data: row
    });

    e.stopPropagation();
  }

  deletePatient(e, row) {
    alert('Delete clicked');
    e.stopPropagation();
  }

  addShowEditProp() {
    this.patients.map((data: any) => {
      data.showEdit = false;
      data.checked = false;
    });
  }

}
