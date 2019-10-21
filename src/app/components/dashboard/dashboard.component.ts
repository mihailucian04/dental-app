import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { DriveData, DashboardData, ChartDataModel, MONTH_NAMES, DEFAULT_MAPPINGS } from 'src/app/models/data.model';
import { DriveService } from 'src/app/services/drive.service';
import { Label, MultiDataSet, Color, BaseChartDirective } from 'ng2-charts';
import { ChartType, ChartDataSets, ChartOptions } from 'chart.js';
import { MatDialog } from '@angular/material';
import { EmcOptionsComponent } from './emc-options/emc-options.component';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { CalendarService } from 'src/app/services/calendar.service';
import { DEFAULT_APPOINTMENTS, Appointment } from 'src/app/models/appointment.model';

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public appointments = DEFAULT_APPOINTMENTS;

  public doughnutChartLabels: Label[] = ['Used (MB)', 'Available (MB)'];
  public doughnutChartData: MultiDataSet = [];
  public doughnutChartType: ChartType = 'doughnut';
  public doughnutChartColors = [
    {
      backgroundColor: [
        'rgba(192, 57, 43, 1)',
        'rgba(39, 174, 96, 1)',
      ]
    }
  ];
  public doughnutChartOptions: any = {
    legend: {
      display: false
    }
  };

  public lineChartData: any = [
    { data: [], label: '' },
    { data: [], label: '' },
  ];
  public lineChartLabels: Label[] = [];
  public lineChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 2000,
      animateScale: true
    }
  };
  public lineChartColors: Color[] = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [];

  public barChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 2000,
      animateScale: true
    }
  };
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];
  public barChartColors = [
    { backgroundColor: '#778ca3' },
    { backgroundColor: '#f7b731' },
  ];

  public barChartData: any = [
    { data: [], label: '', },
    { data: [], label: '' }
  ];

  public dashBoardData: DashboardData = DEFAULT_MAPPINGS.dashboardData;

  public monthLabels: string[] = [];

  public registeredPatients: number;
  public isLoaded = false;
  public mappingsFileId: string;

  constructor(
    private driveService: DriveService,
    private snackBarService: SnackBarService,
    public dialog: MatDialog,
    private ngZone: NgZone,
    private calendarService: CalendarService) {
  }

  ngOnInit() {
    const labels: string[] = [];
    const today = new Date();
    for (let i = 6; i > 0; i -= 1) {
      const day = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const month = MONTH_NAMES[day.getMonth()];
      this.monthLabels.push(month);
    }

    this.lineChartLabels = this.monthLabels;
    this.barChartLabels = this.monthLabels;

    this.ngZone.runOutsideAngular(() => {

      this.driveService.getDriveInfo().then(response => {
        this.ngZone.run(() => {
          const driveResult = response.result;

          const usedSpace = parseFloat((parseInt(driveResult.storageQuota.usageInDrive, 10) / 1000000).toFixed(2));
          const maxSpace = parseFloat((parseInt(driveResult.storageQuota.limit, 10) / 1000000).toFixed(2));
          this.doughnutChartData = [[usedSpace * 5000, maxSpace]];


          const dashBoardDataString = localStorage.getItem('dashboardData');
          this.dashBoardData = JSON.parse(dashBoardDataString);

          this.lineChartData = this._extractChartValues(this.dashBoardData.lineChartData);
          this.barChartData = this._extractChartValues(this.dashBoardData.barChartData, 'a');

          const patientListString = localStorage.getItem('patientsListData');
          this.registeredPatients = (JSON.parse(patientListString)).length;

          const mappingsId = localStorage.getItem('mappingsFileId');
          this.mappingsFileId = mappingsId.substring(1, mappingsId.length - 1);

          const minHour = new Date();
          minHour.setHours(8, 0, 0);

          const maxHour = new Date();
          maxHour.setHours(20, 0, 0);

          this.ngZone.runOutsideAngular(() => {
            this.calendarService.getCalendarEventsRange(minHour, maxHour).then(eventsResponse => {
              this.ngZone.run(() => {
                const apps = this._extractEventsAppointments(eventsResponse.result.items);

                for (const app of apps) {
                  const currentApp = this.appointments.filter(obj => obj.time === app.time)[0];
                  const index = this.appointments.indexOf(currentApp);

                  this.appointments[index] = app;
                }
              });
            });
          });
          this.isLoaded = true;
        });
      });

    });
  }

  public optionsClick() {
    const dialogRef = this.dialog.open(EmcOptionsComponent, {
      width: '300px',
      data: this.dashBoardData.emcPoints
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dashBoardData.emcPoints = result;
        this.dashBoardData.lineChartData = this._extractChartValues(this.lineChartData);
        this.dashBoardData.barChartData = this._extractChartValues(this.barChartData, 'a');

        localStorage.setItem('dashboardData', JSON.stringify(this.dashBoardData));
        const patientList = JSON.parse(localStorage.getItem('patientsListData'));

        const driveData: DriveData = {
          dashboardData: this.dashBoardData,
          patients: patientList,
        };

        this.ngZone.runOutsideAngular(() => {
          this.driveService.updateFileContent(this.mappingsFileId, JSON.stringify(driveData)).then(() => {
            this.ngZone.run(() => {
              this.snackBarService.show('Drive data successfully updated!');
            });
          });
        });
      }
    });
  }

  private _extractEventsAppointments(results: any) {
    const appointments: Appointment[] = [];
    for (const result of results) {
      let displayedIntervalfrom = '';
      let displayedIntervalTo = '';

      const from = new Date(result.start.dateTime);
      const fromminutes = from.getMinutes();
      const fromhours = from.getHours();

      const to = new Date(result.end.dateTime);
      const tominutes = to.getMinutes();
      const tohours = to.getHours();

      if (fromminutes === 0) {
        displayedIntervalfrom = `${fromhours.toString()}:${fromminutes.toString()}0`;
      } else {
        displayedIntervalfrom = `${fromhours.toString()}:${fromminutes.toString()}`;
      }

      if (tominutes === 0) {
        displayedIntervalTo = `${tohours.toString()}:${tominutes.toString()}0`;
      } else {
        displayedIntervalTo = `${tohours.toString()}:${tominutes.toString()}`;
      }

      const appointment = {
        time: `${displayedIntervalfrom} - ${displayedIntervalTo}`,
        patientName: result.summary,
        cssClass: 'timeline-item'
      };
      appointments.push(appointment);
    }
    return appointments;
  }

  private _extractChartValues(chartValues: any, stack?: string, months?: any) {
    const extractedValues: ChartDataModel[] = [];
    for (const chartItem of chartValues) {
      if (stack) {
        const chartBarDataModel = {
          data: this._extractDataForMonths(chartItem.data),
          label: chartItem.label,
          stack
        };
        extractedValues.push(chartBarDataModel);
      } else {
        const chartLineDataModel = {
          data: this._extractDataForMonths(chartItem.data),
          label: chartItem.label,
        };
        extractedValues.push(chartLineDataModel);
      }
    }
    return extractedValues;
  }

  private _extractDataForMonths(chartdata) {
    const currentChartData: number[] = [];
    for (const month of this.monthLabels) {
      const monthIndex = MONTH_NAMES.indexOf(month);
      currentChartData.push(chartdata[monthIndex]);
    }
    return currentChartData;
  }
}
