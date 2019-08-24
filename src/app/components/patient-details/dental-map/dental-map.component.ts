import { Component, OnInit } from '@angular/core';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { ToothDetailsComponent } from './tooth-details/tooth-details.component';
import { Tooth, ToothState } from 'src/app/models/tooth.model';
import { ActivatedRoute } from '@angular/router';
import { Patient } from 'src/app/models/patient.model';
import { Patients } from 'src/app/models/data.model';


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

  constructor(public dialog: MatDialog,
              private route: ActivatedRoute) {
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
      console.log('closed');
    });
  }

  private _initialiseMapView() {
    this.route.paramMap.subscribe(params => {
      const resourceName = params.get('id');
      const patientListString = localStorage.getItem('patientsListData');
      const patientList = JSON.parse(patientListString) as Patients[];

      const patient = patientList.filter(obj => obj.patientId === resourceName)[0];

      this.upperRightSide = patient.dentalMap.slice(0, 8).reverse();
      this.upperLeftSide = patient.dentalMap.slice(8, 16);
      this.lowerLeftSide = patient.dentalMap.slice(16, 24);
      this.lowerRightSide = patient.dentalMap.slice(24, 32);

    });
  }
}
