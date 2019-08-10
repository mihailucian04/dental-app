import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Patient } from 'src/app/models/patient.model';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material';
import { FilePreviewOverlayRef } from 'src/app/services/file-preview-overlay-ref';
import { FilePreviewOverlayService } from 'src/app/services/file-preview-overlay.service';
import { GoogleDataService } from 'src/app/services/google-data.service';

export interface File {
  name: string;
  url: string;
}

export const STATIC_FILE_DATE = [
  {
    name: 'image_1.jpg',
    url: 'https://static.pexels.com/photos/371633/pexels-photo-371633.jpeg'
  },
  {
    name: 'image_2.jpg',
    url: 'https://static.pexels.com/photos/132037/pexels-photo-132037.jpeg'
  },
  {
    name: 'image_3.jpg',
    url: 'https://cdn.allwallpaper.in/wallpapers/1440x900/17110/mountains-nature-trees-rivers-1440x900-wallpaper.jpg'
  },
  {
    name: 'image_4.jpg',
    url: 'https://static.pexels.com/photos/35600/road-sun-rays-path.jpg'
  },
  {
    name: 'image_5.jpg',
    url: 'https://static.pexels.com/photos/223022/pexels-photo-223022.jpeg'
  }
];

export interface Consult {
  date: string;
  details: string;
}

export interface XRay {
  name: string;
  uploaded: string;
  size: string;
  file: File;
}

@Component({
  selector: 'app-patient-details',
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.scss']
})
export class PatientDetailsComponent implements OnInit {
  private patient$: Observable<any>;
  private patient: Patient;

  consults: Consult[] = [
    { date: new Date().toDateString(), details: 'Repair caries' },
    { date: new Date().toDateString(), details: 'Extraction of 1st Molar' },
    { date: new Date().toDateString(), details: 'Extraction of 2st Molar' },
  ];

  xrays: XRay[] = [
    { name: 'x-ray_scan1.jpg', uploaded: new Date().toDateString(), size: '185.22 KB',
    file: { name: 'image_1.jpg', url: 'https://static.pexels.com/photos/371633/pexels-photo-371633.jpeg' } },
    { name: 'x-ray_scan2.jpg', uploaded: new Date().toDateString(), size: '234.10 KB',
    file: { name: 'image_1.jpg', url: 'https://static.pexels.com/photos/371633/pexels-photo-371633.jpeg' } },
    { name: 'x-ray_scan3.jpg', uploaded: new Date().toDateString(), size: '190.78 KB',
    file: { name: 'image_1.jpg', url: 'https://static.pexels.com/photos/371633/pexels-photo-371633.jpeg' } },
    { name: 'x-ray_scan4.jpg', uploaded: new Date().toDateString(), size: '180.22 KB',
    file: { name: 'image_1.jpg', url: 'https://static.pexels.com/photos/371633/pexels-photo-371633.jpeg' } }
  ];


  displayedColumnsConsults: string[] = ['date', 'details'];
  dataSourceConsults = new MatTableDataSource(this.consults);

  displayedColumnsXRays: string[] = ['name', 'uploaded', 'size', 'view', 'download', 'delete'];
  dataSourceXRays = new MatTableDataSource(this.xrays);

  constructor(private route: ActivatedRoute,
              private previewDialog: FilePreviewOverlayService,
              private googleDataService: GoogleDataService,
              private cdRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const selectedId = params.get('id');
      const patient1 = JSON.parse(localStorage.getItem(`patient-details${selectedId}`));
      this.googleDataService.getContact(patient1.resourceName).then((response: any) => {
        this.patient = response;
        this.cdRef.detectChanges();
      });
    });
  }

  showPreview(file) {
    const dialogRef: FilePreviewOverlayRef = this.previewDialog.open({
      image: file
    });
  }

}
