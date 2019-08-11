import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { FilePreviewOverlayRef } from 'src/app/services/file-preview-overlay-ref';
import { FilePreviewOverlayService } from 'src/app/services/file-preview-overlay.service';
export interface File {
  name: string;
  url: string;
}
export interface XRay {
  name: string;
  uploaded: string;
  size: string;
  file: File;
}

@Component({
  selector: 'app-x-rays',
  templateUrl: './x-rays.component.html',
  styleUrls: ['./x-rays.component.scss']
})
export class XRaysComponent implements OnInit {
  xrays: XRay[] = [
    {
      name: 'x-ray_scan1.jpg', uploaded: new Date().toDateString(), size: '185.22 KB',
      file: { name: 'image_1.jpg', url: 'https://static.pexels.com/photos/371633/pexels-photo-371633.jpeg' }
    },
    {
      name: 'x-ray_scan2.jpg', uploaded: new Date().toDateString(), size: '234.10 KB',
      file: { name: 'image_1.jpg', url: 'https://static.pexels.com/photos/371633/pexels-photo-371633.jpeg' }
    },
    {
      name: 'x-ray_scan3.jpg', uploaded: new Date().toDateString(), size: '190.78 KB',
      file: { name: 'image_1.jpg', url: 'https://static.pexels.com/photos/371633/pexels-photo-371633.jpeg' }
    },
    {
      name: 'x-ray_scan4.jpg', uploaded: new Date().toDateString(), size: '180.22 KB',
      file: { name: 'image_1.jpg', url: 'https://static.pexels.com/photos/371633/pexels-photo-371633.jpeg' }
    }
  ];

  displayedColumnsXRays: string[] = ['name', 'uploaded', 'size', 'view', 'download', 'delete'];
  dataSourceXRays = new MatTableDataSource(this.xrays);

  constructor(private previewDialog: FilePreviewOverlayService) { }

  ngOnInit() {
  }

  showPreview(file) {
    const dialogRef: FilePreviewOverlayRef = this.previewDialog.open({
      image: file
    });
  }

}
