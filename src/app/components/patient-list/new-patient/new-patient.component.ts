import { Component, Inject, NgZone } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NewPatient } from 'src/app/models/patient.model';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { ContactsService } from 'src/app/services/contacts.service';

@Component({
  selector: 'app-new-patient',
  templateUrl: './new-patient.component.html',
  styleUrls: ['./new-patient.component.scss']
})
export class NewPatientComponent {

  constructor(
    public dialogRef: MatDialogRef<NewPatientComponent>,
    @Inject(MAT_DIALOG_DATA) public data: NewPatient,
    private contactsService: ContactsService,
    private ngZone: NgZone,
    private snackBarService: SnackBarService) {}

  public savePatient() {
    this.ngZone.runOutsideAngular(() => {
      this.contactsService.addNewPatient(this.data).then(() => {
        this.ngZone.run(() => {
          this.snackBarService.show('Patient successfully added!');
          this.dialogRef.close();
        });
      });
    });
  }

  public closeDialog() {
    this.dialogRef.close();
  }
}
