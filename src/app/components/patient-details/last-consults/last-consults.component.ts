import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';

export interface Consult {
  date: string;
  details: string;
}

@Component({
  selector: 'app-last-consults',
  templateUrl: './last-consults.component.html',
  styleUrls: ['./last-consults.component.scss']
})
export class LastConsultsComponent implements OnInit {
  consults: Consult[] = [
    { date: new Date().toDateString(), details: 'Repair caries' },
    { date: new Date().toDateString(), details: 'Extraction of 1st Molar' },
    { date: new Date().toDateString(), details: 'Extraction of 2st Molar' },
  ];
  displayedColumnsConsults: string[] = ['date', 'details'];
  dataSourceConsults = new MatTableDataSource(this.consults);
  constructor() { }

  ngOnInit() {
  }

}
