import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit, NgZone } from '@angular/core';
import { Patient, NewPatient } from 'src/app/models/patient.model';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { NewPatientComponent } from './new-patient/new-patient.component';
import { ContactsService } from 'src/app/services/contacts.service';
import { EditPatientComponent } from './edit-patient/edit-patient.component';
import { PatientMap, DriveData } from 'src/app/models/data.model';
import { DriveService } from 'src/app/services/drive.service';
import { SelectionModel } from '@angular/cdk/collections';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { RemoveConfirmationComponent } from './remove-confirmation/remove-confirmation.component';

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

  public displayedColumns: string[] = ['select', 'avatar', 'surname', 'age', 'lastConsult', 'company', 'phone', 'edit'];
  public dataSource: any;
  public isLoaded = false;
  public newPatient: NewPatient = { firstName: '', lastName: '', phoneNumber: '',
                                    emailAddress: '', company: '', jobTitle: 'patient', dob: '' };

  public masterCheck = false;
  public masterCheckVisible = false;
  public masterCheckIndeterminate = false;

  public selection = new SelectionModel<Patient>(true, []);

  public patients: any;

  public searchFilter = '';

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private router: Router,
    private contactsService: ContactsService,
    private driveService: DriveService,
    private snackBarService: SnackBarService,
    private ngZone: NgZone,
    public dialog: MatDialog) { }

  ngOnInit() {
    this._getPatientList();
  }

  ngAfterViewInit() {
  }

  private _getPatientList() {
    this.ngZone.runOutsideAngular(() => {
      this.contactsService.getPatientsContactGroup().then((contactGroupResponse: any) => {
        this.contactsService.getPatients(contactGroupResponse.resourceName).then((patients) => {
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

  addPatientDialog(): void {
    const dialogRef = this.dialog.open(NewPatientComponent, {
      width: '550px',
      data: this.newPatient,
      autoFocus: false,
      disableClose: true
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

  removeFromCabinet(e, row) {
    let dataToDelete: any = {};

    if (this.selection.selected.length > 0) {
      dataToDelete = this.selection.selected;
    } else {
      dataToDelete = row;
    }

    const dialogRef = this.dialog.open(RemoveConfirmationComponent, {
      width: '550px',
      data: dataToDelete
    });

    dialogRef.afterClosed().subscribe((response) => {
      if (response === 'removed') {
        this.selection.clear();
        this.snackBarService.show(`${row.surname} ${row.name} was removed from cabinet!`);
        this._getPatientList();
       }
    });

    e.stopPropagation();
  }

  multipleRemoveFromCabinet(e) {
    if (this.selection.selected) {
      const dialogRef = this.dialog.open(RemoveConfirmationComponent, {
        width: '550px',
        data: this.selection.selected
      });

      let removedPatients = '';
      this.selection.selected.map(item => {
        removedPatients += `${item.surname} ${item.name}, `;
      });

      dialogRef.afterClosed().subscribe((response) => {
        if (response === 'removed') {
          this.snackBarService.show(`${removedPatients} were removed from cabinet!`);
          this.selection.clear();
          this._getPatientList();
        }
      });
    }

    e.stopPropagation();
  }

  deletePatient(e, row) {
    alert('Delete clicked');
    e.stopPropagation();
  }

  addShowEditProp() {
    this.patients.map((data: any) => {
      data.showEdit = false;
    });
  }

  clearSelection() {
    this.selection.clear();
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  inputFocus() {
    document.getElementById('input-wrapper').style.outline = '1px solid #5cc2ff';
  }

  inputFocusOut() {
    document.getElementById('input-wrapper').style.outline = 'none';
  }

  clearSearchFilter() {
    this.dataSource.filter = '';
    this.searchFilter = '';
  }
}
