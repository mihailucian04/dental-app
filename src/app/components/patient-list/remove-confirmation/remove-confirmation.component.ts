import { Component, OnInit, Inject, NgZone } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PatientMap, DriveData } from 'src/app/models/data.model';
import { ContactsService } from 'src/app/services/contacts.service';
import { DriveService } from 'src/app/services/drive.service';

@Component({
  selector: 'app-remove-confirmation',
  templateUrl: './remove-confirmation.component.html',
  styleUrls: ['./remove-confirmation.component.scss']
})
export class RemoveConfirmationComponent {

  public namesToRemove = '';
  public isLoading = false;

  constructor(
    public dialogRef: MatDialogRef<RemoveConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ngZone: NgZone,
    private contactsService: ContactsService,
    private driveService: DriveService
  ) {
    if (Array.isArray(data)) {
      data.map(item => {
        this.namesToRemove += `${item.name} ${item.surname}, `;
      });
    } else {
      this.namesToRemove = `${data.name} ${data.surname}`;
    }
  }

  public removePatients() {
    this.isLoading = true;

    const patientsToRemove: string[] = [];

    const mappingsFileIdStr = localStorage.getItem('mappingsFileId');
    const mappingsFileId = mappingsFileIdStr.substring(1, mappingsFileIdStr.length - 1);

    const dashBoardDataString = localStorage.getItem('dashboardData');
    const dashboardData = JSON.parse(dashBoardDataString);

    const patientListString = localStorage.getItem('patientsListData');
    const patients = JSON.parse(patientListString) as PatientMap[];

    if (Array.isArray(this.data)) {
      this.data.map(item => {
        const currentPatient = patients.filter(patient => item.resourceName === patient.patientId)[0];
        const currentPatientIndex = patients.indexOf(currentPatient);

        patients[currentPatientIndex].isRemoved = true;
        patientsToRemove.push(`people/${item.resourceName}`);
      });
    } else {
      const currentPatient = patients.filter(patient => this.data.resourceName === patient.patientId)[0];
      const currentPatientIndex = patients.indexOf(currentPatient);

      patients[currentPatientIndex].isRemoved = true;
      patientsToRemove.push(`people/${this.data.resourceName}`);
    }

    const updatedDriveData: DriveData = {
      dashboardData,
      patients
    };

    this.ngZone.runOutsideAngular(() => {
      this.contactsService.getPatientsContactGroup().then((contactGroupResponse: any) => {
        this.contactsService.updatePatientsContactGroup(contactGroupResponse.resourceName, [], patientsToRemove).then(() => {
          this.driveService.updateFileContent(mappingsFileId, JSON.stringify(updatedDriveData)).then(() => {
            this.ngZone.run(() => {
              localStorage.setItem('patientsListData', JSON.stringify(patients));
              this.isLoading = false;
              this.dialogRef.close('removed');
            });
          });
        });
      });
    });
  }

  public closeDialog() {
    this.dialogRef.close();
  }
}
