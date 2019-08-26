import { Component, OnInit, Inject, NgZone } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { DriveService } from 'src/app/services/drive.service';

@Component({
  selector: 'app-delete-xray',
  templateUrl: './delete-xray.component.html',
  styleUrls: ['./delete-xray.component.scss']
})
export class DeleteXrayComponent {

  constructor(
    public dialogRef: MatDialogRef<DeleteXrayComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ngZone: NgZone,
    private driveService: DriveService) { }

  public deleteFile() {
    this.ngZone.runOutsideAngular(() => {
      this.driveService.deleteDriveFile(this.data).then(() => {
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
