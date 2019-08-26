import { Component, OnInit, NgZone } from '@angular/core';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { Consult } from 'src/app/models/consult.model';
import { DriveService } from 'src/app/services/drive.service';
import { ActivatedRoute } from '@angular/router';
import { PatientMap } from 'src/app/models/data.model';
import { NewConsultComponent } from './new-consult/new-consult.component';

@Component({
  selector: 'app-last-consults',
  templateUrl: './last-consults.component.html',
  styleUrls: ['./last-consults.component.scss']
})
export class LastConsultsComponent implements OnInit {
  consults: Consult[] = [];
  displayedColumnsConsults: string[] = ['date', 'details'];
  dataSourceConsults: any;

  public resourceName: string;
  public consultFileId: string;

  constructor(private ngZone: NgZone,
              private route: ActivatedRoute,
              private driveService: DriveService,
              public dialog: MatDialog) { }

  ngOnInit() {
    this._getLatestConsults();
  }

  public openDialog(): void {
    const dialogRef = this.dialog.open(NewConsultComponent, {
      width: '500px',
      data: {
        consultFileId: this.consultFileId,
        consults: this.consults
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._getLatestConsults();
      }
    });
  }

  private _getLatestConsults() {
    this.route.paramMap.subscribe(params => {
      this.resourceName = params.get('id');
      const patientListString = localStorage.getItem('patientsListData');
      const patientList = JSON.parse(patientListString) as PatientMap[];

      const patient = patientList.filter(obj => obj.patientId === this.resourceName)[0];
      this.consultFileId = patient.consultFileId;

      this.ngZone.runOutsideAngular(() => {
        this.driveService.exportFileContent(this.consultFileId).then((response) => {
          this.ngZone.run(() => {
            const result = response.substr(1);
            this.dataSourceConsults = new MatTableDataSource<Consult>();
            if (result !== '') {
              this.consults = JSON.parse(result);
            }
            this.dataSourceConsults.data = this.consults;
          });
        });
      });
    });
  }
}
