import { Component, OnInit, ViewChild } from '@angular/core';
import { Patient } from 'src/app/models/patient.model';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.scss']
})
export class PatientListComponent implements OnInit {

  public patientList: Patient[] = [
    { guid: '1', name: 'Lizzy', surname: 'Marko', age: '23', cnp: '19607015934', dob: new Date(),
     lastConsult: new Date().toLocaleDateString(), imageUrl: 'https://material.angular.io/assets/img/examples/shiba1.jpg' },
    { guid: '2', name: 'Phaenna', surname: 'Romana', age: '34', cnp: '29508122018', dob: new Date(),
     lastConsult: new Date().toLocaleDateString(), imageUrl: 'https://material.angular.io/assets/img/examples/shiba1.jpg' },
    { guid: '3', name: 'Aurora', surname: 'Iustinianus', age: '24', cnp: '29807135248', dob: new Date(),
     lastConsult: new Date().toLocaleDateString(), imageUrl: 'https://material.angular.io/assets/img/examples/shiba1.jpg' },
    { guid: '4', name: 'Hardwin', surname: 'Chlodovech', age: '32', cnp: '27710028673', dob: new Date(),
     lastConsult: new Date().toLocaleDateString(), imageUrl: 'https://material.angular.io/assets/img/examples/shiba1.jpg' },
    { guid: '5', name: 'Rafael', surname: 'Vilmantas', age: '20', cnp: '18011016738', dob: new Date(),
     lastConsult: new Date().toLocaleDateString(), imageUrl: 'https://material.angular.io/assets/img/examples/shiba1.jpg' },
    { guid: '6', name: 'Juliya', surname: 'Raylene', age: '28', cnp: '29907041395', dob: new Date(),
     lastConsult: new Date().toLocaleDateString(), imageUrl: 'https://material.angular.io/assets/img/examples/shiba1.jpg' },
    { guid: '7', name: 'Anna', surname: 'Eifion', age: '40', cnp: '18212092756', dob: new Date(),
     lastConsult: new Date().toLocaleDateString(), imageUrl: 'https://material.angular.io/assets/img/examples/shiba1.jpg' },
    { guid: '8', name: 'Célio', surname: 'Haregewoin', age: '48', cnp: '28008019543', dob: new Date(),
     lastConsult: new Date().toLocaleDateString(), imageUrl: 'https://material.angular.io/assets/img/examples/shiba1.jpg' },
    { guid: '9', name: 'Mandla', surname: 'Dalia', age: '29', cnp: '27808093391', dob: new Date(),
     lastConsult: new Date().toLocaleDateString(), imageUrl: 'https://material.angular.io/assets/img/examples/shiba1.jpg' },
    { guid: '10', name: 'Moyra', surname: 'Marjani', age: '27', cnp: '27208172283', dob: new Date(),
     lastConsult: new Date().toLocaleDateString(), imageUrl: 'https://material.angular.io/assets/img/examples/shiba1.jpg' },
    { guid: '11', name: 'Divya', surname: 'Ahti', age: '31', cnp: '29811039487', dob: new Date(),
     lastConsult: new Date().toLocaleDateString(), imageUrl: 'https://material.angular.io/assets/img/examples/shiba1.jpg' },
    { guid: '12', name: 'Sjakie', surname: 'Ioudas', age: '28', cnp: '29410291296', dob: new Date(),
     lastConsult: new Date().toLocaleDateString(), imageUrl: 'https://material.angular.io/assets/img/examples/shiba1.jpg' },
    { guid: '13', name: 'Christiaan', surname: 'Lucina', age: '46', cnp: '17509306396', dob: new Date(),
     lastConsult: new Date().toLocaleDateString(), imageUrl: 'https://material.angular.io/assets/img/examples/shiba1.jpg' },
    { guid: '14', name: 'Andraste', surname: 'Karin', age: '32', cnp: '27406241270', dob: new Date(),
     lastConsult: new Date().toLocaleDateString(), imageUrl: 'https://material.angular.io/assets/img/examples/shiba1.jpg' },
    { guid: '15', name: 'Valdimárr', surname: 'Holden', age: '34', cnp: '29412229321', dob: new Date(),
     lastConsult: new Date().toLocaleDateString(), imageUrl: 'https://material.angular.io/assets/img/examples/shiba1.jpg' },
    { guid: '16', name: 'Iva', surname: 'Vespera', age: '20', cnp: '19806111359', dob: new Date(),
     lastConsult: new Date().toLocaleDateString(), imageUrl: 'https://material.angular.io/assets/img/examples/shiba1.jpg' },
    { guid: '17', name: 'Sandford', surname: 'Andro', age: '33', cnp: '17708136543', dob: new Date(),
     lastConsult: new Date().toLocaleDateString(), imageUrl: 'https://material.angular.io/assets/img/examples/shiba1.jpg' },
    { guid: '18', name: 'Shanthi', surname: 'Anna', age: '29', cnp: '29306275876', dob: new Date(),
     lastConsult: new Date().toLocaleDateString(), imageUrl: 'https://material.angular.io/assets/img/examples/shiba1.jpg' },
    { guid: '19', name: 'Om', surname: 'Mansur', age: '47', cnp: '18709157368', dob: new Date(),
     lastConsult: new Date().toLocaleDateString(), imageUrl: 'https://material.angular.io/assets/img/examples/shiba1.jpg' },
    { guid: '20', name: 'Ralphie', surname: 'Ujarak', age: '28', cnp: '18611292531', dob: new Date(),
     lastConsult: new Date().toLocaleDateString(), imageUrl: 'https://material.angular.io/assets/img/examples/shiba1.jpg' },
    { guid: '21', name: 'Josef', surname: 'Čedomir', age: '29', cnp: '17508133985', dob: new Date(),
     lastConsult: new Date().toLocaleDateString(), imageUrl: 'https://material.angular.io/assets/img/examples/shiba1.jpg' },
    { guid: '21', name: 'Iustinus', surname: 'Moana', age: '38', cnp: '27710191976', dob: new Date(),
     lastConsult: new Date().toLocaleDateString(), imageUrl: 'https://material.angular.io/assets/img/examples/shiba1.jpg' },
    { guid: '22', name: 'Marijse', surname: 'Ryuu', age: '31', cnp: '28008019625', dob: new Date(),
     lastConsult: new Date().toLocaleDateString(), imageUrl: 'https://material.angular.io/assets/img/examples/shiba1.jpg' },
    { guid: '23', name: 'Jehoiachin', surname: 'Taylan', age: '31', cnp: '29312062968', dob: new Date(),
     lastConsult: new Date().toLocaleDateString(), imageUrl: 'https://material.angular.io/assets/img/examples/shiba1.jpg' },
    { guid: '24', name: 'Gittel', surname: 'Kanti', age: '25', cnp: '28807053096', dob: new Date(),
     lastConsult: new Date().toLocaleDateString(), imageUrl: 'https://material.angular.io/assets/img/examples/shiba1.jpg' },
    { guid: '25', name: 'Micael', surname: 'Emil', age: '21', cnp: '17009188833', dob: new Date(),
     lastConsult: new Date().toLocaleDateString(), imageUrl: 'https://material.angular.io/assets/img/examples/shiba1.jpg' },
    { guid: '26', name: 'Morgane', surname: 'Olivia', age: '28', cnp: '18511087061', dob: new Date(),
     lastConsult: new Date().toLocaleDateString(), imageUrl: 'https://material.angular.io/assets/img/examples/shiba1.jpg' }
  ];
  displayedColumns: string[] = ['avatar', 'surname', 'age', 'cnp', 'lastConsult', 'update'];
  dataSource = new MatTableDataSource(this.patientList);

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private router: Router) { }

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  navigateTo(row: Patient) {
    localStorage.setItem(`patient-details${row.guid}`, JSON.stringify(row));
    this.router.navigate([`/patient-details/${row.guid}`]);
  }

}
