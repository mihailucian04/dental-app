import { Component, Inject, NgZone } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { DatePipe } from '@angular/common';
import { CalendarService } from 'src/app/services/calendar.service';

export interface HourOption {
  value: string;
  viewValue: string;
}

const hourOptions: HourOption[] = [
  { value: '7:00:00', viewValue: '7:00' },
  { value: '7:30:00', viewValue: '7:30' },
  { value: '8:00:00', viewValue: '8:00' },
  { value: '8:30:00', viewValue: '8:30' },
  { value: '9:00:00', viewValue: '9:00' },
  { value: '9:30:00', viewValue: '9:30' },
  { value: '10:00:00', viewValue: '10:00' },
  { value: '10:30:00', viewValue: '10:30' },
  { value: '11:00:00', viewValue: '11:00' },
  { value: '11:30:00', viewValue: '11:30' },
  { value: '12:00:00', viewValue: '12:00' },
  { value: '12:30:00', viewValue: '12:30' },
  { value: '13:00:00', viewValue: '13:00' },
  { value: '13:30:00', viewValue: '13:30' },
  { value: '14:00:00', viewValue: '14:00' },
  { value: '14:30:00', viewValue: '14:30' },
  { value: '15:00:00', viewValue: '15:00' },
  { value: '15:30:00', viewValue: '15:30' },
  { value: '16:00:00', viewValue: '16:00' },
  { value: '16:30:00', viewValue: '16:30' },
  { value: '17:00:00', viewValue: '17:00' },
  { value: '17:30:00', viewValue: '17:30' },
  { value: '18:00:00', viewValue: '18:00' },
  { value: '18:30:00', viewValue: '18:30' },
  { value: '19:00:00', viewValue: '19:00' },
  { value: '19:30:00', viewValue: '19:30' },
];

@Component({
  selector: 'app-new-appointment',
  templateUrl: './new-appointment.component.html',
  styleUrls: ['./new-appointment.component.scss']
})
export class NewAppointmentComponent {

  public fromHours = hourOptions;
  public toHours = hourOptions;

  public patientName: string;
  public appointmentDate: Date;
  public fromHour: string;
  public toHour: string;
  public description: string;

  private googleDateFrom: Date;
  private googleDateTo: Date;
  private eventId: string;

  public dialogIconStyles: any = {
    color: '#e6dddc',
    'font-size': '30px',
  };

  public addEvent = true;

  constructor(
    public dialogRef: MatDialogRef<NewAppointmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private calendarService: CalendarService,
    private ngZone: NgZone,
    private snackBarService: SnackBarService,
    private datePipe: DatePipe) {
    if (data.intention !== 'add') {
      this.addEvent = false;

      this.eventId = data.event.id;
      this.patientName = this._extractPatientName(data.event.title);
      this.description = this._extractAppointmentDetails(data.event.title);
      this.appointmentDate = this._extractDate(data.event.start);
      this.fromHour = this._extractHour(data.event.start);
      this.toHour = this._extractHour(data.event.end);
    }
  }

  public saveAppointment() {
    const timeDetailsFrom = this.fromHour.split(':');
    const timeDetailsTo = this.toHour.split(':');

    this.appointmentDate.setHours(parseInt(timeDetailsFrom[0], 10), parseInt(timeDetailsFrom[1], 10), parseInt(timeDetailsFrom[2], 10));
    this.googleDateFrom = new Date(this.appointmentDate);

    this.appointmentDate.setHours(parseInt(timeDetailsTo[0], 10), parseInt(timeDetailsTo[1], 10), parseInt(timeDetailsTo[2], 10));
    this.googleDateTo = new Date(this.appointmentDate);

    if (this.addEvent) {
      this.ngZone.runOutsideAngular(() => {
        this.calendarService.addCalendarEvent(this.patientName,
          this.googleDateFrom.toISOString(),
          this.googleDateTo.toISOString(),
          this.description).then(() => {
            this.ngZone.run(() => {
              this.dialogRef.close();
              this.snackBarService.show('Appointment successfully added!');
            });
          });
      });
    } else {
      this.ngZone.runOutsideAngular(() => {
        this.calendarService.updateCalendarEventDetails(this.patientName,
          this.description,
          this.googleDateFrom.toISOString(),
          this.googleDateTo.toISOString(),
          this.eventId).then(() => {
            this.ngZone.run(() => {
              this.dialogRef.close();
              this.snackBarService.show('Appointment successfully updated!');
            });
          });
      });
    }

    console.log(this.googleDateFrom.toUTCString());
  }

  public closeDialog() {
    this.dialogRef.close();
  }

  private _extractPatientName(eventTitle: string): string {
    return eventTitle.split(' - ')[0];
  }

  private _extractAppointmentDetails(eventTitle: string): string {
    return eventTitle.split(' - ')[1];
  }

  private _extractDate(eventDate: Date) {
    return new Date(this.datePipe.transform(eventDate, 'MM/dd/yyyy'));
  }

  private _extractHour(eventDate: Date) {
    const minutes = eventDate.getMinutes();
    const hours = eventDate.getHours();

    if (minutes === 0) {
      return hours.toString() + ':' + minutes.toString() + '0:00';
    } else {
      return hours.toString() + ':' + minutes.toString() + ':00';
    }
  }
}
