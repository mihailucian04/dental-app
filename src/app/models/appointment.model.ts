export interface Appointment {
    time: string;
    patientName: string;
    cssClass?: string;
}

export const DEFAULT_APPOINTMENTS: Appointment[] = [
    { time: '8:00 - 8:30', patientName: 'No appointment', cssClass: 'timeline-item-free' },
    { time: '8:30 - 9:00', patientName: 'No appointment', cssClass: 'timeline-item-free' },
    { time: '9:00 - 9:30', patientName: 'No appointment', cssClass: 'timeline-item-free' },
    { time: '9:30 - 10:00', patientName: 'No appointment', cssClass: 'timeline-item-free' },
    { time: '10:00 - 10:30', patientName: 'No appointment', cssClass: 'timeline-item-free' },
    { time: '10:30 - 11:00', patientName: 'No appointment', cssClass: 'timeline-item-free' },
    { time: '11:00 - 11:30', patientName: 'No appointment', cssClass: 'timeline-item-free' },
    { time: '11:30 - 12:00', patientName: 'No appointment', cssClass: 'timeline-item-free' },
    { time: '12:00 - 12:30', patientName: 'No appointment', cssClass: 'timeline-item-free' },
    { time: '12:30 - 13:00', patientName: 'No appointment', cssClass: 'timeline-item-free' },
    { time: '13:00 - 13:30', patientName: 'No appointment', cssClass: 'timeline-item-free' },
    { time: '13:30 - 14:00', patientName: 'No appointment', cssClass: 'timeline-item-free' },
    { time: '14:00 - 14:30', patientName: 'No appointment', cssClass: 'timeline-item-free' },
    { time: '15:00 - 15:30', patientName: 'No appointment', cssClass: 'timeline-item-free' },
    { time: '15:30 - 16:00', patientName: 'No appointment', cssClass: 'timeline-item-free' },
    { time: '16:00 - 16:30', patientName: 'No appointment', cssClass: 'timeline-item-free' },
    { time: '16:30 - 17:00', patientName: 'No appointment', cssClass: 'timeline-item-free' },
    { time: '17:00 - 17:30', patientName: 'No appointment', cssClass: 'timeline-item-free' },
    { time: '17:30 - 18:00', patientName: 'No appointment', cssClass: 'timeline-item-free' },
    { time: '18:00 - 18:30', patientName: 'No appointment', cssClass: 'timeline-item-free' },
    { time: '18:30 - 19:00', patientName: 'No appointment', cssClass: 'timeline-item-free' },
    { time: '18:30 - 19:00', patientName: 'No appointment', cssClass: 'timeline-item-free' },
    { time: '19:00 - 19:30', patientName: 'No appointment', cssClass: 'timeline-item-free' },
    { time: '19:30 - 20:00', patientName: 'No appointment', cssClass: 'timeline-item-free' },
];
