import { Component, OnInit, Inject, NgZone } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DriveService } from 'src/app/services/drive.service';

@Component({
  selector: 'app-delete-xray',
  templateUrl: './delete-xray.component.html',
  styleUrls: ['./delete-xray.component.scss']
})
export class DeleteXrayComponent {

  public type = '';

  constructor(
    public dialogRef: MatDialogRef<DeleteXrayComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ngZone: NgZone,
    private driveService: DriveService) {
      this.type = data.type;
     }

  public deleteFile() {
    this.ngZone.runOutsideAngular(() => {
      this.driveService.deleteDriveFile(this.data.fileId).then(() => {
        this.ngZone.run(() => {
          this.dialogRef.close('deleted');
        });
      });
    });
  }

  public closeDialog() {
    this.dialogRef.close();
  }
}
