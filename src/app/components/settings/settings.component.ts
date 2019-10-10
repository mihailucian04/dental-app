import { Component, OnInit, NgZone } from '@angular/core';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { DashboardData } from 'src/app/models/data.model';
import { EditValueComponent } from './edit-value/edit-value.component';
import { DriveService } from 'src/app/services/drive.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';

export interface DashBoardTableEntry {
  month: string;
  lastYearIncome: number;
  thisYearIncome: number;
  lastYearPatients: number;
  thisYearPatients: number;
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  public monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  public displayedColumnsStatistics: string[] = ['month', 'lastYearIncome', 'thisYearIncome',
    'lastYearPatients', 'thisYearPatients', 'edit'];
  public dataSourceStatistics: any;
  public entries: DashBoardTableEntry[] = [];

  public dashBoardData = {} as DashboardData;

  constructor(
    public dialog: MatDialog,
    private ngZone: NgZone,
    private driveService: DriveService,
    private snackBarService: SnackBarService) { }

  ngOnInit() {
    this._populateEntries();
    this.dataSourceStatistics = new MatTableDataSource<DashBoardTableEntry>();
    this.dataSourceStatistics.data = this.entries;
  }

  public openEditDialog(row: any) {
    const dialogRef = this.dialog.open(EditValueComponent, {
      data: row
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const currentMonthRow = this.entries.indexOf(row);
        this.entries[currentMonthRow] = result;
        this.dataSourceStatistics.data = this.entries;

        this._updateNewDashboardData();
      }
    });
  }

  private _populateEntries() {

    const dashboardString = localStorage.getItem('dashboardData');
    this.dashBoardData = JSON.parse(dashboardString);

    for (const month of this.monthNames) {
      const index = this.monthNames.indexOf(month);
      const dashBoardEntry = {
        month,
        lastYearIncome: this.dashBoardData.lineChartData[1].data[index],
        thisYearIncome: this.dashBoardData.lineChartData[0].data[index],
        lastYearPatients: this.dashBoardData.barChartData[0].data[index],
        thisYearPatients: this.dashBoardData.barChartData[1].data[index]
      };
      this.entries.push(dashBoardEntry);
    }
  }

  private _updateNewDashboardData() {
    const dashboardString = localStorage.getItem('dashboardData');
    this.dashBoardData = JSON.parse(dashboardString);

    const listPatientString = localStorage.getItem('patientsListData');
    const patientList = JSON.parse(listPatientString);

    const mappingsFileIdString = localStorage.getItem('mappingsFileId');
    const mappingsFileId = mappingsFileIdString.substring(1, mappingsFileIdString.length - 1);

    for (const entry of this.entries) {
      const index = this.entries.indexOf(entry);

      this.dashBoardData.lineChartData[0].data[index] = this.entries[index].thisYearIncome;
      this.dashBoardData.lineChartData[1].data[index] = this.entries[index].lastYearIncome;

      this.dashBoardData.barChartData[0].data[index] = this.entries[index].lastYearPatients;
      this.dashBoardData.barChartData[1].data[index] = this.entries[index].thisYearPatients;
    }

    const newDriveData = {
      dashboardData: this.dashBoardData,
      patients: patientList
    };

    this.ngZone.runOutsideAngular(() => {
      this.driveService.updateFileContent(mappingsFileId, JSON.stringify(newDriveData)).then(() => {
        this.ngZone.run(() => {
          localStorage.setItem('dashboardData', JSON.stringify(newDriveData.dashboardData));
          this.snackBarService.show('Drive data successfully updated!');
        });
      });
    });
  }
}
