import { Component, OnInit, NgZone } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ToothDetailsComponent } from './tooth-details/tooth-details.component';
import { Tooth, DEFAULT_DENTAL_MAP } from 'src/app/models/tooth.model';
import { ActivatedRoute } from '@angular/router';
import { PatientMap } from 'src/app/models/data.model';
import { DriveService } from 'src/app/services/drive.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';

@Component({
  selector: 'app-dental-map',
  templateUrl: './dental-map.component.html',
  styleUrls: ['./dental-map.component.scss']
})
export class DentalMapComponent implements OnInit {

  public upperLeftSide: Tooth[] = [];
  public upperRightSide: Tooth[] = [];
  public lowerLeftSide: Tooth[] = [];
  public lowerRightSide: Tooth[] = [];

  private resourceName: string;
  private mappingsFileId: string;
  private blankDentalFile: any;

  public isLoaded = false;

  constructor(public dialog: MatDialog,
              private route: ActivatedRoute,
              private ngZone: NgZone,
              private driveService: DriveService,
              private snackBarService: SnackBarService) {
  }

  ngOnInit() {
    this._initialiseMapView();
  }

  public showToothDetails(tooth: Tooth) {
    const dialogRef = this.dialog.open(ToothDetailsComponent, {
      width: '500px',
      data: tooth
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.number >= 1 && result.number <= 8) {
          const index = this.upperRightSide.indexOf(tooth);
          this.upperRightSide[index] = result;
        } else if (result.number >= 9 && result.number <= 16) {
          const index = this.upperLeftSide.indexOf(tooth);
          this.upperLeftSide[index] = result;
        } else if (result.number >= 16 && result.number <= 24) {
          const index = this.lowerLeftSide.indexOf(tooth);
          this.lowerLeftSide[index] = result;
        } else if (result.number >= 24 && result.number <= 32) {
          const index = this.lowerRightSide.indexOf(tooth);
          this.lowerRightSide[index] = result;
        }

        const updatedToothArray = [
          ...this.upperRightSide,
          ...this.upperLeftSide,
          ...this.lowerLeftSide,
          ...this.lowerRightSide
        ];

        const sortedToothArray = updatedToothArray.sort((obj1, obj2) => obj1.number - obj2.number);

        this._updateDriveData(sortedToothArray);
      }

    });
  }

  public openBlanDentalMap() {
    window.open(this.blankDentalFile.webViewLink);
  }

  private _initialiseMapView() {
    this.route.paramMap.subscribe(params => {
      this.resourceName = params.get('id');
      const patientListString = localStorage.getItem('patientsListData');
      const patientList = JSON.parse(patientListString) as PatientMap[];

      const patient = patientList.filter(obj => obj.patientId === this.resourceName)[0];

      this.mappingsFileId = patient.dentalMapFileId;

      this.ngZone.runOutsideAngular(() => {
        this.driveService.exportFileContent(patient.dentalMapFileId).then(response => {
            const result = response.substr(1);
            this.driveService.getDriveFile(patient.blankDentalFileId).then((blankFileResponse) => {
              this.ngZone.run(() => {
              this.blankDentalFile = blankFileResponse.result;

              if (result !== '') {
                this._splitToothArray(JSON.parse(result));
              } else {
                this._createDefaultMappings(patient);
              }

              this.isLoaded = true;
            });
          });
        });
      });
    });
  }

  private _updateDriveData(toothArray) {
    this.ngZone.runOutsideAngular(() => {
      this.driveService.updateFileContent(this.mappingsFileId, JSON.stringify(toothArray)).then(() => {
        this.ngZone.run(() => {
          this.snackBarService.show('Drive data updated!');
        });
      });
    });
  }

  private _createDefaultMappings(patient: PatientMap) {
    this.ngZone.runOutsideAngular(() => {
      this.driveService.updateFileContent(patient.dentalMapFileId, JSON.stringify(DEFAULT_DENTAL_MAP)).then(() => {
        this.ngZone.run(() => {
          this._splitToothArray(DEFAULT_DENTAL_MAP);
        });
      });
    });
  }

  private _splitToothArray(toothArray) {
    this.upperRightSide = toothArray.slice(0, 8).reverse();
    this.upperLeftSide = toothArray.slice(8, 16).reverse();
    this.lowerLeftSide = toothArray.slice(16, 24);
    this.lowerRightSide = toothArray.slice(24, 32);
  }
}
