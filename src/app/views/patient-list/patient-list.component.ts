import { Component, OnInit } from '@angular/core';
import { Patient } from 'src/app/models/patient.model';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.scss']
})
export class PatientListComponent implements OnInit {

  public patientList: Patient[] = [
    { guid: '1', name: 'firstname', surname: 'lastname', age: '23', cnp: '123', dob: new Date(), lastConsult: new Date() },
    { guid: '2', name: 'firstname', surname: 'lastname', age: '23', cnp: '123', dob: new Date(), lastConsult: new Date() },
    { guid: '3', name: 'firstname', surname: 'lastname', age: '23', cnp: '123', dob: new Date(), lastConsult: new Date() },
    { guid: '4', name: 'firstname', surname: 'lastname', age: '23', cnp: '123', dob: new Date(), lastConsult: new Date() },
    { guid: '5', name: 'firstname', surname: 'lastname', age: '23', cnp: '123', dob: new Date(), lastConsult: new Date() },
    { guid: '6', name: 'firstname', surname: 'lastname', age: '23', cnp: '123', dob: new Date(), lastConsult: new Date() },
    { guid: '7', name: 'firstname', surname: 'lastname', age: '23', cnp: '123', dob: new Date(), lastConsult: new Date() },
    { guid: '1', name: 'firstname', surname: 'lastname', age: '23', cnp: '123', dob: new Date(), lastConsult: new Date() },
    { guid: '2', name: 'firstname', surname: 'lastname', age: '23', cnp: '123', dob: new Date(), lastConsult: new Date() },
    { guid: '3', name: 'firstname', surname: 'lastname', age: '23', cnp: '123', dob: new Date(), lastConsult: new Date() },
    { guid: '4', name: 'firstname', surname: 'lastname', age: '23', cnp: '123', dob: new Date(), lastConsult: new Date() },
    { guid: '5', name: 'firstname', surname: 'lastname', age: '23', cnp: '123', dob: new Date(), lastConsult: new Date() },
    { guid: '6', name: 'firstname', surname: 'lastname', age: '23', cnp: '123', dob: new Date(), lastConsult: new Date() },
    { guid: '7', name: 'firstname', surname: 'lastname', age: '23', cnp: '123', dob: new Date(), lastConsult: new Date() },
    // { guid: '7', name: 'firstname', surname: 'lastname', age: '23', cnp: '123', dob: new Date(), lastConsult: new Date() },
    // { guid: '7', name: 'firstname', surname: 'lastname', age: '23', cnp: '123', dob: new Date(), lastConsult: new Date() },
    // { guid: '7', name: 'firstname', surname: 'lastname', age: '23', cnp: '123', dob: new Date(), lastConsult: new Date() },
    // { guid: '7', name: 'firstname', surname: 'lastname', age: '23', cnp: '123', dob: new Date(), lastConsult: new Date() },
    // { guid: '7', name: 'firstname', surname: 'lastname', age: '23', cnp: '123', dob: new Date(), lastConsult: new Date() },
    // { guid: '7', name: 'firstname', surname: 'lastname', age: '23', cnp: '123', dob: new Date(), lastConsult: new Date() },
    // { guid: '7', name: 'firstname', surname: 'lastname', age: '23', cnp: '123', dob: new Date(), lastConsult: new Date() },
    // { guid: '7', name: 'firstname', surname: 'lastname', age: '23', cnp: '123', dob: new Date(), lastConsult: new Date() },
    // { guid: '7', name: 'firstname', surname: 'lastname', age: '23', cnp: '123', dob: new Date(), lastConsult: new Date() },
    // { guid: '7', name: 'firstname', surname: 'lastname', age: '23', cnp: '123', dob: new Date(), lastConsult: new Date() },
    // { guid: '7', name: 'firstname', surname: 'lastname', age: '23', cnp: '123', dob: new Date(), lastConsult: new Date() },
    // { guid: '7', name: 'firstname', surname: 'lastname', age: '23', cnp: '123', dob: new Date(), lastConsult: new Date() },
    // { guid: '7', name: 'firstname', surname: 'lastname', age: '23', cnp: '123', dob: new Date(), lastConsult: new Date() }
  ];
  displayedColumns: string[] = ['name', 'surname', 'age', 'cnp'];
  dataSource = this.patientList;
  constructor() { }

  ngOnInit() {
  }

}
