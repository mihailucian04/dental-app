import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label, Color, BaseChartDirective, MultiDataSet } from 'ng2-charts';
import * as pluginAnnotations from 'chartjs-plugin-datalabels';
import * as Chart from 'chart.js';

export interface Appointment {
  time: string;
  patientName: string;
}

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

  public lineChartData: ChartDataSets[] = [
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Incomes' },
  ];

  public lineChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June'];
  public lineChartOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      xAxes: [{}],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
        },
        // {
        //   id: 'y-axis-1',
        //   position: 'right',
        //   gridLines: {
        //     color: 'rgba(255,0,0,0.3)',
        //   },
        //   ticks: {
        //     fontColor: 'red',
        //   }
        // }
      ]
    },
    annotation: {
      annotations: [
        {
          type: 'line',
          mode: 'vertical',
          scaleID: 'x-axis-0',
          value: 'March',
          borderColor: 'orange',
          borderWidth: 2,
          label: {
            enabled: true,
            fontColor: 'orange',
            content: 'LineAnno'
          }
        },
      ],
    },
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
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [pluginAnnotations];

  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartLabels: Label[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Females', stack: 'a' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Males', stack: 'a' }
  ];

  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;

  public doughnutChartLabels: Label[] = ['', ''];
  public doughnutChartData: MultiDataSet = [
    [150, 450],
  ];
  public doughnutChartColors = [
    {
      backgroundColor: [
        'rgba(192, 57, 43, 1)',
        'rgba(39, 174, 96, 1)',
      ]
    }
  ];
  public doughnutChartType: ChartType = 'doughnut';
  public doughnutChartOptions = {
    legend: {
      display: false
    },
    tooltips: {
      enabled: false,
      displayColors: false
    }
  };

  public appointments: Appointment[] = [
    { time: '7:00 - 7:30', patientName: 'Marko, Lizzy' },
    { time: '7:30 - 8:00', patientName: 'Karin, Andraste' },
    { time: '8:00 - 9:00', patientName: 'Lucina, Christiaan' },
    { time: '9:00 - 10:30', patientName: 'Ahti, Divya' },
    { time: '11:00 - 12:30', patientName: 'Raylene, Juliya' },
    { time: '12:30 - 14:00', patientName: 'Dalia, Mandla' },
    { time: '14:30 - 15:00', patientName: 'Marjani, Moyra' },
    { time: '15:00 - 16:00', patientName: 'Romana, Phaenna' },
    { time: '16:00 - 17:00', patientName: 'Vilmantas, Rafael' },
    { time: '17:00 - 18:00', patientName: 'Ioudas, Sjakie' },
    { time: '18:00 - 18:30', patientName: 'Eifion, Anna' }
  ];

  constructor() { }

  ngOnInit() {
  }

}
