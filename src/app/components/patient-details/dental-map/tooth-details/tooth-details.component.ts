import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Tooth } from 'src/app/models/tooth.model';

@Component({
  selector: 'app-tooth-details',
  templateUrl: './tooth-details.component.html',
  styleUrls: ['./tooth-details.component.scss']
})
export class ToothDetailsComponent {

  public dialogTooth: Tooth;
  private initialTooth = {} as Tooth;

  constructor(public dialogRef: MatDialogRef<ToothDetailsComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Tooth) {
                this.dialogTooth = JSON.parse(JSON.stringify(data));
               }

  public saveToothDetails() {
    this.dialogRef.close(this.dialogTooth);
  }

  public closeDialog() {
    this.dialogRef.close();
  }

}
