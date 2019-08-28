import { Component, OnInit, NgZone } from '@angular/core';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { FilePreviewOverlayRef } from 'src/app/components/file-preview-overlay-toolbar/file-preview-overlay/file-preview-overlay-ref';
import { FilePreviewOverlayService } from 'src/app/services/file-preview-overlay.service';
import { ActivatedRoute } from '@angular/router';
import { DriveService } from 'src/app/services/drive.service';
import { PatientMap } from 'src/app/models/data.model';
import { DeleteXrayComponent } from './delete-xray/delete-xray.component';
import { SnackBarService } from 'src/app/services/snack-bar.service';

declare var gapi: any;

export interface FileDrive {
  name: string;
  url: string;
}
export interface XRay {
  fileId: string;
  name: string;
  uploaded: string;
  size: string;
  webContentLink: string;
  file: FileDrive;
}

@Component({
  selector: 'app-x-rays',
  templateUrl: './x-rays.component.html',
  styleUrls: ['./x-rays.component.scss']
})
export class XRaysComponent implements OnInit {
  xrays: XRay[] = [];

  displayedColumnsXRays: string[] = ['name', 'uploaded', 'size', 'view', 'download', 'delete'];
  dataSourceXRays: any;

  public resourceName: string;
  public xRaysFolderId: string;

  public isLoading = false;

  constructor(
    private previewDialog: FilePreviewOverlayService,
    private ngZone: NgZone,
    private route: ActivatedRoute,
    private driveService: DriveService,
    public dialog: MatDialog,
    private snackBarService: SnackBarService) { }

  ngOnInit() {
    this._getXrays();
  }

  public handleFileInput(files) {
    this.isLoading = true;

    const file = files[0];

    const boundary = '-------314159265358979323846';
    const delimiter = '\r\n--' + boundary + '\r\n';
    const closedelim = '\r\n--' + boundary + '--';

    const reader = new FileReader();
    reader.readAsBinaryString(file);

    reader.onload = (() => {
      const contentType = file.type || 'application/octet-stream';
      const metadata = {
        title: file.name,
        mimeType: contentType,
        permissions: [
          { role: 'reader', type: 'anyone' },
        ],
        parents: [
          {
            id: this.xRaysFolderId
          }
        ]
      };

      const base64Data = btoa(reader.result.toString());
      const multipartRequestBody =
        delimiter +
        'Content-Type: application/json\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        'Content-Type: ' + contentType + '\r\n' +
        'Content-Transfer-Encoding: base64\r\n' +
        '\r\n' +
        base64Data +
        closedelim;

      this.ngZone.runOutsideAngular(() => {
        this.driveService.uploadFileTest(boundary, multipartRequestBody).then((response) => {
          this.ngZone.run(() => {
            const uploadedXRay = response.result;

            const fileSize = parseInt(uploadedXRay.fileSize, 10) / 1000;
            const xray = {
              name: uploadedXRay.title, uploaded: new Date(uploadedXRay.createdDate).toDateString(), fileId: uploadedXRay.id,
              size: fileSize.toString() + ' KB', webContentLink: uploadedXRay.webContentLink,
              file: { name: uploadedXRay.title, url: `https://drive.google.com/uc?export=view&id=${uploadedXRay.id}` }
            };

            this.ngZone.runOutsideAngular(() => {
              this.driveService.createPermissions(uploadedXRay.id).then(() => {
                this.ngZone.run(() => {
                  this.isLoading = false;
                  this.xrays.push(xray);
                  this.dataSourceXRays.data = this.xrays;
                  this.snackBarService.show('X-Ray successfully uploaded!');
                });
              });
            });
          });
        });
      });
    });
  }

  public openDeleteDialog(fileId: string) {
    const dialogRef = this.dialog.open(DeleteXrayComponent, {
      data: {fileId, type: 'x-ray'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'deleted') {
        const currentXray = this.xrays.filter(obj => obj.fileId === fileId)[0];
        const index = this.xrays.indexOf(currentXray, 0);
        this.xrays.splice(index, 1);
        this.dataSourceXRays.data = this.xrays;
        this.snackBarService.show('X-Ray successfully removed!');
      }
    });
  }

  public showPreview(file) {
    const dialogRef: FilePreviewOverlayRef = this.previewDialog.open({
      image: file
    });
  }

  public downloadFile(xray) {
    window.open(xray.webContentLink, '_self');
  }

  private _getXrays() {
    this.route.paramMap.subscribe(params => {
      this.resourceName = params.get('id');
      const patientListString = localStorage.getItem('patientsListData');
      const patientList = JSON.parse(patientListString) as PatientMap[];

      const patient = patientList.filter(obj => obj.patientId === this.resourceName)[0];
      this.xRaysFolderId = patient.xRayFolderId;

      this.ngZone.runOutsideAngular(() => {
        this.driveService.listFolderChildren(this.xRaysFolderId).then((response) => {
          this.ngZone.run(() => {
            const xrayItems = response.result.items;

            if (xrayItems.length > 0) {
              const xrayRequestBatch = gapi.client.newBatch();

              // const fields = 'id,name,createdTime,size,webContentLink';
              const fields = '*';
              for (const xrayItem of xrayItems) {
                const xrayRequest = this.driveService.getFileBatch(xrayItem.id, fields);
                xrayRequestBatch.add(xrayRequest);
              }
              xrayRequestBatch.then(xrayBatchResponse => {
                const xrayBatchResult = xrayBatchResponse.result;
                this.dataSourceXRays = new MatTableDataSource<XRay>();

                Object.keys(xrayBatchResult).map(index => {

                  const xrayfile = xrayBatchResult[index].result as any;
                  const fileSize = parseInt(xrayfile.size, 10) / 1000;

                  const xray = {
                    name: xrayfile.name, uploaded: new Date(xrayfile.createdTime).toDateString(), fileId: xrayfile.id,
                    size: fileSize.toString() + ' KB', webContentLink: xrayfile.webContentLink,
                    file: { name: xrayfile.name, url: `https://drive.google.com/uc?export=view&id=${xrayfile.id}` }
                  };

                  this.xrays.push(xray);
                });
                this.dataSourceXRays.data = this.xrays;
              });
            }
          });
        });
      });
    });
  }
}
