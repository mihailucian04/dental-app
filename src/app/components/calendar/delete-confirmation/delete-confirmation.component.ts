import { Component, OnInit, Inject, NgZone } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { CalendarService } from 'src/app/services/calendar.service';

@Component({
  selector: 'app-delete-confirmation',
  templateUrl: './delete-confirmation.component.html',
  styleUrls: ['./delete-confirmation.component.scss']
})
export class DeleteConfirmationComponent {

  constructor(
    public dialogRef: MatDialogRef<DeleteConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private calendarService: CalendarService,
    private ngZone: NgZone,
    private snackBarService: SnackBarService) { }

    public deleteAppointment() {
      this.ngZone.runOutsideAngular(() => {
        this.calendarService.deleteCalendarEvent(this.data.id).then(() => {
          this.ngZone.run(() => {
            this.dialogRef.close();
            this.snackBarService.show('Appointemnt successfully deleted!');
          });
        });
      });
    }

    public closeDialog() {
      this.dialogRef.close();
    }
}
