import { Component, OnInit, NgZone } from '@angular/core';
import { DriveService } from 'src/app/services/drive.service';
import { ActivatedRoute } from '@angular/router';
import { PatientMap } from 'src/app/models/data.model';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { FileDrive } from '../x-rays/x-rays.component';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { FilePreviewOverlayService } from 'src/app/services/file-preview-overlay.service';
import { FilePreviewOverlayRef } from '../../file-preview-overlay-toolbar/file-preview-overlay/file-preview-overlay-ref';
import { DeleteXrayComponent } from '../x-rays/delete-xray/delete-xray.component';
declare var gapi: any;
export interface PatientFile {
  name: string;
  uploadDate: string;
  mimeType: string;
  fileId: string;
  webContentLink: string;
  file: FileDrive;
}

@Component({
  selector: 'app-patient-files',
  templateUrl: './patient-files.component.html',
  styleUrls: ['./patient-files.component.scss']
})
export class PatientFilesComponent implements OnInit {

  public blankPatientFile = {} as any;
  public resourceName = {};

  public patientFileFolderId: string;

  public patientFiles: PatientFile[] = [ ];
  public displayedColumnsPatientFiles: string[] = ['name', 'uploaded', 'type', 'view', 'download', 'delete'];
  public dataSourcePatientFiles: any;

  public isLoading = false;

  constructor(
    private driveService: DriveService,
    private ngZone: NgZone,
    private route: ActivatedRoute,
    private snackBarService: SnackBarService,
    private previewDialog: FilePreviewOverlayService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.resourceName = params.get('id');
      const patientListString = localStorage.getItem('patientsListData');
      const patientList = JSON.parse(patientListString) as PatientMap[];

      this.dataSourcePatientFiles = new MatTableDataSource<PatientFile>();
      this.dataSourcePatientFiles.data = this.patientFiles;

      const patient = patientList.filter(obj => obj.patientId === this.resourceName)[0];
      const blankPatientFileId = patient.blankPatientFileId;

      this.ngZone.runOutsideAngular(() => {
        this.driveService.getDriveFile(blankPatientFileId).then(response => {
          this.ngZone.run(() => {
            this.blankPatientFile = response.result;
          });
        });
      });
      this._getPatientFiles();
    });
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
            id: this.patientFileFolderId
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
            const uploadedPatientFile = response.result;

            const patientfile = {
              name: uploadedPatientFile.title, uploadDate: new Date(uploadedPatientFile.createdDate).toDateString(),
              fileId: uploadedPatientFile.id,
              webContentLink: uploadedPatientFile.webContentLink, mimeType: uploadedPatientFile.mimeType,
              file: { name: uploadedPatientFile.title, url: `https://drive.google.com/uc?export=view&id=${uploadedPatientFile.id}` }
            };

            this.ngZone.runOutsideAngular(() => {
              this.driveService.createPermissions(uploadedPatientFile.id).then(() => {
                this.ngZone.run(() => {
                  this.isLoading = false;
                  this.patientFiles.push(patientfile);
                  this.dataSourcePatientFiles.data = this.patientFiles;
                  this.snackBarService.show('Patient file successfully uploaded!');
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
      data: {fileId, type: 'patient file'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'deleted') {
        const currentXray = this.patientFiles.filter(obj => obj.fileId === fileId)[0];
        const index = this.patientFiles.indexOf(currentXray, 0);
        this.patientFiles.splice(index, 1);
        this.dataSourcePatientFiles.data = this.patientFiles;
        this.snackBarService.show('Patient file successfully removed!');
      }
    });
  }

  public showPreview(file) {
    const dialogRef: FilePreviewOverlayRef = this.previewDialog.open({
      image: file
    });
  }

  public downloadFile(patientFile) {
    window.open(patientFile.webContentLink, '_self');
  }

  public printBlankPatientFile() {
    window.open(this.blankPatientFile.webViewLink);
  }

  private _getPatientFiles() {
    this.route.paramMap.subscribe(params => {
      this.resourceName = params.get('id');
      const patientListString = localStorage.getItem('patientsListData');
      const patientList = JSON.parse(patientListString) as PatientMap[];

      const patient = patientList.filter(obj => obj.patientId === this.resourceName)[0];
      this.patientFileFolderId = patient.patientFileFolderId;

      this.ngZone.runOutsideAngular(() => {
        this.driveService.listFolderChildren(this.patientFileFolderId).then((response) => {
          this.ngZone.run(() => {
            const patientFileItems = response.result.items;

            if (patientFileItems.length > 0) {
              const patientFileRequestBatch = gapi.client.newBatch();
              const fields = '*';
              for (const patientFileItem of patientFileItems) {
                const patientFileRequest = this.driveService.getFileBatch(patientFileItem.id, fields);
                patientFileRequestBatch.add(patientFileRequest);
              }
              patientFileRequestBatch.then(patientFileBatchResponse => {
                const patientFileBatchResult = patientFileBatchResponse.result;
                this.dataSourcePatientFiles = new MatTableDataSource<PatientFile>();

                Object.keys(patientFileBatchResult).map(index => {

                  const patientFile = patientFileBatchResult[index].result as any;
                  const fileSize = parseInt(patientFile.size, 10) / 1000;

                  const patientfile = {
                    name: patientFile.name, uploadDate: new Date(patientFile.createdTime).toDateString(), fileId: patientFile.id,
                    webContentLink: patientFile.webContentLink, mimeType: 'PDF',
                    file: { name: patientFile.name, url: `https://drive.google.com/uc?export=view&id=${patientFile.id}` }
                  };

                  this.patientFiles.push(patientfile);
                });
                this.dataSourcePatientFiles.data = this.patientFiles;
              });
            }
          });
        });
      });
    });
  }
}
