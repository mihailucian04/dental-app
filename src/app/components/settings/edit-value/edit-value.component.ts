import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DashBoardTableEntry } from '../settings.component';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-edit-value',
  templateUrl: './edit-value.component.html',
  styleUrls: ['./edit-value.component.scss']
})
export class EditValueComponent {

  public monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

  public currentDashboardData = {} as DashBoardTableEntry;

  public readOnlyEditCurrentYear = false;

  constructor(
    public dialogRef: MatDialogRef<EditValueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.currentDashboardData = JSON.parse(JSON.stringify(data));

      const monthIndex = this.monthNames.indexOf(this.currentDashboardData.month);

      const nowDate = new Date();
      const editDate = new Date();
      editDate.setMonth(monthIndex);

      if (editDate > nowDate) {
        this.readOnlyEditCurrentYear = true;
        this.currentDashboardData.thisYearIncome = 0;
        this.currentDashboardData.thisYearPatients = 0;
      }

    }

  public saveData() {
    this.dialogRef.close(this.currentDashboardData);
  }

  public closeDialog() {
    this.dialogRef.close();
  }


}
