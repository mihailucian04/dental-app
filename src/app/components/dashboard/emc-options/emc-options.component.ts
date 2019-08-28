import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { EMCPoints } from 'src/app/models/data.model';

@Component({
  selector: 'app-emc-options',
  templateUrl: './emc-options.component.html',
  styleUrls: ['./emc-options.component.scss']
})
export class EmcOptionsComponent {

  public newEmcPoints = {} as EMCPoints;

  constructor(
    public dialogRef: MatDialogRef<EmcOptionsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EMCPoints) {
      this.newEmcPoints = JSON.parse(JSON.stringify(data));
     }

  public saveEmcOptions() {
    this.dialogRef.close(this.newEmcPoints);
  }
  public closeEmcPoints() {
    this.dialogRef.close();
  }

}
