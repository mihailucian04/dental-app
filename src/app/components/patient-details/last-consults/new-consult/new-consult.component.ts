import { Component, Inject, NgZone } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Consult } from 'src/app/models/consult.model';
import { DriveService } from 'src/app/services/drive.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';

@Component({
  selector: 'app-new-consult',
  templateUrl: './new-consult.component.html',
  styleUrls: ['./new-consult.component.scss']
})
export class NewConsultComponent {

  public newConsult = {} as Consult;
  public consultDate: Date;

  public consultFileId: string;
  public consults: Consult[];

  constructor(public dialogRef: MatDialogRef<NewConsultComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private driveService: DriveService,
              private ngZone: NgZone,
              private snackBarService: SnackBarService) {
                this.consultFileId = data.consultFileId;
                this.consults = data.consults;
               }

  public saveConsult() {

    this.newConsult.date = this.consultDate.toDateString();

    this.consults.push(this.newConsult);

    this.ngZone.runOutsideAngular(() => {
      this.driveService.updateFileContent(this.consultFileId, JSON.stringify(this.consults)).then(() => {
        this.ngZone.run(() => {
          this.dialogRef.close({newConsults: this.consults});
          this.snackBarService.show('Drive data updated!');
        });
      });
    });
  }

  public closeDialog() {
    this.dialogRef.close();
  }

}
