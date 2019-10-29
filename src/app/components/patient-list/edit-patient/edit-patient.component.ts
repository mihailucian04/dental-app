import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Patient } from 'src/app/models/patient.model';

@Component({
  selector: 'app-edit-patient',
  templateUrl: './edit-patient.component.html',
  styleUrls: ['./edit-patient.component.scss']
})
export class EditPatientComponent {

  constructor(
    public dialogRef: MatDialogRef<EditPatientComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Patient) {
      // TODO: fix dob format storage
      this.data.dob = new Date(this.data.dob).toISOString();
    }

    public closeDialog() {
      this.dialogRef.close();
    }

    public savePatient() {
      console.log('saved');
    }
}
