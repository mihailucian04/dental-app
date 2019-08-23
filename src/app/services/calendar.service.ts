import { Injectable } from '@angular/core';
declare var gapi: any;

@Injectable({
    providedIn: 'root'
})
export class CalendarService {
    constructor() { }

    public getCalendarEvents() {

        return gapi.client.calendar.events.list({
            calendarId: 'primary',
            timeMin: (new Date(1900, 0, 1)).toISOString(),
            showDeleted: false,
            singleEvents: true,
            maxResults: 20,
            orderBy: 'startTime'
        }).then((response: any) => {
            const events = response.result.items;
            return events;
        });
    }

    public addCalendarEvent(summary: string, startTime: string, endTime: string, description: string) {
        const resource = {
            summary,
            description,
            start: {
                dateTime: startTime
            },
            end: {
                dateTime: endTime
            }
        };

        return gapi.client.calendar.events.insert({
            calendarId: 'primary',
            resource
        });
    }

    public updateCalendarEventDetails(summary: string, description: string, startTime: string, endTime: string, eventId: string) {
        const resource = {
            summary,
            description,
            start: {
                dateTime: startTime
            },
            end: {
                dateTime: endTime
            }
        };

        return gapi.client.calendar.events.patch({
            calendarId: 'primary',
            eventId,
            resource
        });
    }

    public updateCalendarEventHours(startTime: string, endTime: string, eventId: string) {
        const resource = {
            start: {
                dateTime: startTime
            },
            end: {
                dateTime: endTime
            }
        };

        return gapi.client.calendar.events.patch({
            calendarId: 'primary',
            eventId,
            resource
        });
    }

    public deleteCalendarEvent(eventId: string) {
        const params = {
            calendarId: 'primary',
            eventId
        };

        return gapi.client.calendar.events.delete(params).then((response) => {
            console.log(response);
        });
    }
}
