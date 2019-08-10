import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Patient } from 'src/app/models/patient.model';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { GoogleDataService } from 'src/app/services/google-data.service';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.scss']
})
export class PatientListComponent implements OnInit {


  displayedColumns: string[] = ['avatar', 'surname', 'age', 'lastConsult', 'company', 'update'];
  dataSource: any;
  // dataSource = new MatTableDataSource(this.patientList);

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private router: Router,
              private authService: AuthService,
              private cdRef: ChangeDetectorRef,
              private googleDataService: GoogleDataService) { }

  ngOnInit() {
    this.googleDataService.getContacts().then((response: any) => {
      this.dataSource = new MatTableDataSource(response);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.cdRef.detectChanges();
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  navigateTo(row: Patient) {
    localStorage.setItem(`patient-details${row.guid}`, JSON.stringify(row));
    this.router.navigate([`/patient-details/${row.guid}`]);
  }

}
