import { Component, OnInit } from '@angular/core';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { ToothDetailsComponent } from './tooth-details/tooth-details.component';
import { Tooth, ToothState } from 'src/app/models/tooth.model';


@Component({
  selector: 'app-dental-map',
  templateUrl: './dental-map.component.html',
  styleUrls: ['./dental-map.component.scss']
})
export class DentalMapComponent implements OnInit {

  // consults: Consult[] = [
  //   { date: new Date().toDateString(), details: 'Repair caries' },
  //   { date: new Date().toDateString(), details: 'Extraction of 1st Molar' },
  //   { date: new Date().toDateString(), details: 'Extraction of 2st Molar' },
  //   { date: new Date().toDateString(), details: 'Extraction of 2st Molar' },
  //   { date: new Date().toDateString(), details: 'Extraction of 2st Molar' },
  //   { date: new Date().toDateString(), details: 'Extraction of 2st Molar' },
  // ];
  // displayedColumnsConsults: string[] = ['date', 'details'];
  // dataSourceConsults = new MatTableDataSource(this.consults);

  public upperLeftSide: Tooth[] = [];
  public upperRightSide: Tooth[] = [];
  public lowerLeftSide: Tooth[] = [];
  public lowerRightSide: Tooth[] = [];

  constructor(public dialog: MatDialog) {
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
    let index = 1;
    for ( ; index <= 8; index++) {
      const tooth: Tooth = {
        number: index,
        state: ToothState.Healty,
        operationDetails: ''
      };

      if (index === 5) {
        tooth.state = ToothState.Missing;
      }
      this.upperRightSide.push(tooth);
    }

    for ( ; index <= 16; index++) {
      const tooth: Tooth = {
        number: index,
        state: ToothState.Healty,
        operationDetails: ''
      };

      if (index === 10) {
        tooth.state = ToothState.Fake;
      }

      this.upperLeftSide.push(tooth);
    }

    for ( ; index <= 24; index++) {
      const tooth: Tooth = {
        number: index,
        state: ToothState.Healty,
        operationDetails: ''
      };

      if (index === 20) {
        tooth.state = ToothState.ExtractedNerve;
      }

      this.lowerLeftSide.push(tooth);
    }

    for ( ; index <= 32; index++) {
      const tooth: Tooth = {
        number: index,
        state: ToothState.Healty,
        operationDetails: ''
      };
      this.lowerRightSide.push(tooth);
    }
  }
}
