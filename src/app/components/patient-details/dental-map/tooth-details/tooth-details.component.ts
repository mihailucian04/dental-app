import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Tooth, ToothState } from 'src/app/models/tooth.model';



@Component({
  selector: 'app-tooth-details',
  templateUrl: './tooth-details.component.html',
  styleUrls: ['./tooth-details.component.scss']
})
export class ToothDetailsComponent {

  public tooth: Tooth;

  constructor(public dialogRef: MatDialogRef<ToothDetailsComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Tooth) {
                this.tooth = data;
               }

  public saveToothDetails() {
    console.log(this.tooth.operationDetails);
  }

  public closeDialog() {
    this.dialogRef.close();
  }

}
