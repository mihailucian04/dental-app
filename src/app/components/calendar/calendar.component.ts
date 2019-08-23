
import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  OnInit,
  NgZone
} from '@angular/core';

import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView
} from 'angular-calendar';
import { MatDialog } from '@angular/material';
import { DeleteConfirmationComponent } from './delete-confirmation/delete-confirmation.component';
import { NewAppointmentComponent } from './new-appointment/new-appointment.component';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { CalendarService } from 'src/app/services/calendar.service';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil-alt" style="color:#007bff"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      }
    },
    {
      // label: '<fa-icon icon="building" [styles]="{ \'color\': \'#e6dddc\', \'font-size\': \'30px\'}" [fixedWidth]="true">',
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.deleteEvent(event);
      }
    }
  ];

  refresh: Subject<any> = new Subject();
  events: CalendarEvent[] = [];
  // events: CalendarEvent[] = [
  //   {
  //     start: subDays(startOfDay(new Date()), 1),
  //     end: addDays(new Date(), 1),
  //     title: 'A 3 day event',
  //     color: colors.red,
  //     actions: this.actions,
  //     allDay: true,
  //     resizable: {
  //       beforeStart: true,
  //       afterEnd: true
  //     },
  //     draggable: true
  //   },
  //   {
  //     start: startOfDay(new Date()),
  //     title: 'An event with no end date',
  //     color: colors.yellow,
  //     actions: this.actions
  //   },
  //   {
  //     start: subDays(endOfMonth(new Date()), 3),
  //     end: addDays(endOfMonth(new Date()), 3),
  //     title: 'A long event that spans 2 months',
  //     color: colors.blue,
  //     allDay: true
  //   },
  //   {
  //     start: addHours(startOfDay(new Date()), 2),
  //     end: new Date(),
  //     title: 'A draggable and resizable event',
  //     color: colors.yellow,
  //     actions: this.actions,
  //     resizable: {
  //       beforeStart: true,
  //       afterEnd: true
  //     },
  //     draggable: true
  //   }
  // ];

  activeDayIsOpen = false;

  ngOnInit(): void {
    this._getCalendarEvents();
  }

  private _getCalendarEvents() {
    this.ngZone.runOutsideAngular(() => {
      this.calendarService.getCalendarEvents().then((response) => {
        this.ngZone.run(() => {
          this.events = this.extractCalendarResponse(response);
        });
      });
    });
  }

  constructor(private modal: NgbModal,
              private calendarService: CalendarService,
              private ngZone: NgZone,
              public dialog: MatDialog,
              private snackBarService: SnackBarService) {}

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {

    this.ngZone.runOutsideAngular(() => {
      this.calendarService.updateCalendarEventHours(newStart.toISOString(), newEnd.toISOString(), event.id.toString()).then(() => {
        this.ngZone.run(() => {
          this._getCalendarEvents();
          this.snackBarService.show('Event successfully updated!');
        });
      });
    });

    this.events = this.events.map(iEvent => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd
        };
      }
      return iEvent;
    });
  }

  handleEvent(action: string, event: CalendarEvent): void {

    if (action === 'Clicked' || action === 'Edited') {
      const dialogRef = this.dialog.open(NewAppointmentComponent, {
        data: {
          intention: 'update',
          event
        }
      });

      dialogRef.afterClosed().subscribe(() => {
        this._getCalendarEvents();
      });
    }
  }

  addEvent(): void {
    const dialogRef = this.dialog.open(NewAppointmentComponent, {
      data: {
        intention: 'add'
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      this._getCalendarEvents();
    });
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      data: eventToDelete
    });

    dialogRef.afterClosed().subscribe(result => {
      this._getCalendarEvents();
    });
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  private extractCalendarResponse(response: any) {
    const eventList: CalendarEvent[] = [];
    for (const event of response) {
      const mappedEvent: CalendarEvent = {
        id: event.id,
        start: new Date(event.start.dateTime),
        end: new Date(event.end.dateTime),
        title: event.summary + ' - ' + event.description,
        color: colors.red,
        actions: this.actions,
        cssClass: 'event-item',
        draggable: true,
      };
      eventList.push(mappedEvent);
    }
    console.log('Event list', eventList);
    return eventList;
  }
}
