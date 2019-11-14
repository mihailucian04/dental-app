import { Component, Inject, NgZone, OnChanges, SimpleChanges, SimpleChange, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NewPatient } from 'src/app/models/patient.model';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { ContactsService } from 'src/app/services/contacts.service';
import { FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { DriveService } from 'src/app/services/drive.service';

export class PatientOption {
  fullName: string;
  photo: string;
  resourceName: string;
}

@Component({
  selector: 'app-new-patient',
  templateUrl: './new-patient.component.html',
  styleUrls: ['./new-patient.component.scss']
})
export class NewPatientComponent implements OnChanges {

  public patientsOptions: PatientOption[] = [];
  public stateCtrl = new FormControl();
  public filteredPatients: Observable<PatientOption[]>;
  public selectedPatient: string;

  public isLoading = false;
  public newEntry = false;

  public inputChange = new Subject();

  constructor(
    public dialogRef: MatDialogRef<NewPatientComponent>,
    @Inject(MAT_DIALOG_DATA) public data: NewPatient,
    private contactsService: ContactsService,
    private driveService: DriveService,
    private ngZone: NgZone,
    private snackBarService: SnackBarService) {

    this.ngZone.runOutsideAngular(() => {
      this.contactsService.getPatientsSelection().then((optionsResponse) => {
        this.ngZone.run(() => {
          optionsResponse.map(item => {
            const selection: PatientOption = {
              fullName: `${item.name} ${item.surname}`,
              photo: item.imageUrl,
              resourceName: item.resourceName
            };
            this.patientsOptions.push(selection);
          });
          this.filteredPatients = this.stateCtrl.valueChanges
            .pipe(
              startWith(''),
              map(contact => contact ? this._filterContacts(contact) : this.patientsOptions.slice())
            );
        });
      });
    });
  }

  private _filterContacts(value: string): PatientOption[] {
    const filterValue = value.toLowerCase();

    return this.patientsOptions.filter(contact => contact.fullName.toLowerCase().indexOf(filterValue) === 0);
  }

  public savePatient() {
    this.isLoading = true;
    if (this.newEntry) {
      this.ngZone.runOutsideAngular(() => {
        this.contactsService.addNewPatient(this.data).then(() => {
          this.ngZone.run(() => {
            this.isLoading = false;
            this.snackBarService.show('Patient successfully added!');
            this.dialogRef.close();
          });
        });
      });
    } else {
      const selectedP = this.patientsOptions.filter(item => item.fullName === this.selectedPatient)[0];
      this.ngZone.runOutsideAngular(() => {
        this.driveService.initDriveDataForPatient(selectedP.resourceName).then(() => {
          this.contactsService.getPatientsContactGroup().then((contactGroupResult: any) => {
            const contactGroupResourceName = contactGroupResult.resourceName;
            this.contactsService.addPatientToContactGroup(contactGroupResourceName, `people/${selectedP.resourceName}`).then(() => {
              this.ngZone.run(() => {
                this.isLoading = false;
                this.snackBarService.show('Patient successfully added!');
                this.dialogRef.close();
              });
            });
          });
        });
      });
    }
  }

  onChange(e) {
    this.inputChange.next(e);
    console.log(this.inputChange);
    console.log('ddd');
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const name: SimpleChange = changes.name;
    console.log(name);
  }

  public changedModel(e) {
    console.log(e.target.data);
  }

  public closeDialog() {
    this.dialogRef.close();
  }
}
