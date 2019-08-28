import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { Patient } from 'src/app/models/patient.model';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ContactsService } from 'src/app/services/contacts.service';
import { DriveService } from 'src/app/services/drive.service';

@Component({
  selector: 'app-patient-details',
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.scss']
})
export class PatientDetailsComponent implements OnInit {
  public patient = {} as Patient;
  public blanPatientFile: any;

  constructor(
    private route: ActivatedRoute,
    private contactsService: ContactsService,
    public driveService: DriveService,
    private ngZone: NgZone) { }

  ngOnInit() {
    this._getPatient();
  }

  private _getPatient() {
    this.route.paramMap.subscribe(params => {
      const resourceName = params.get('id');
      this.ngZone.runOutsideAngular(() => {
        this.contactsService.getContact(resourceName).then((patient: Patient) => {
          this.ngZone.run(() => {
            this.patient = patient;

            const patientListString = localStorage.getItem('patientsListData');
            const patientList = JSON.parse(patientListString);

            const currentPatient = patientList.filter(obj => obj.patientId === resourceName)[0];

            this.ngZone.runOutsideAngular(() => {
              this.driveService.exportFileContent(currentPatient.consultFileId).then(response => {
                this.ngZone.run(() => {
                  const resultString = response.substr(1);
                  if (resultString) {
                    const result = JSON.parse(resultString);
                    this.patient.lastConsult = this._getLatestConsult(result);
                  }
                });
              });
            });
          });
        });
      });
    });
  }

  private _populateBlankFileIdTemp() {
    const param = 'name contains \'patient.file.blank\'';
    this.ngZone.runOutsideAngular(() => {
      this.driveService.listFilesByParam(param).then(response => {
        this.ngZone.run(() => {
          const fileResult = response.result.files[0];

          const patientListString = localStorage.getItem('patientsListData');
          const patientList = JSON.parse(patientListString);

          const newPatients = [];
          for (const patient of patientList) {
            const newPatient = patient;
            newPatient.blankPatientFileId = fileResult.id;

            newPatients.push(newPatient);
          }

          const dashboardDataString = localStorage.getItem('dashboardData');
          const dashboardData1 = JSON.parse(dashboardDataString);

          const newDriveData = {
            dashboardData: dashboardData1,
            patients: newPatients
          };

          const mappingsIdString = localStorage.getItem('mappingsFileId');
          const mappingsId = mappingsIdString.substring(1, mappingsIdString.length - 1);

          this.ngZone.runOutsideAngular(() => {
            this.driveService.updateFileContent(mappingsId, JSON.stringify(newDriveData)).then(response1 => {
              this.ngZone.run(() => {
                console.log(response1);
              });
            });
          });

        });
      });
    });
  }

  private _getLatestConsult(consults) {
    const parsedConsults = [];

    for (const consult of consults) {
      const parsedConsult = {
        date: new Date(consult.date),
        details: consult.details
      };
      parsedConsults.push(parsedConsult);
    }

    parsedConsults.sort((a, b) => {
      return a.date.getTime() - b.date.getTime();
    });

    return parsedConsults[parsedConsults.length - 1].date.toDateString();
  }
}
