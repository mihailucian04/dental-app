import { Injectable } from '@angular/core';
import { Patient } from '../models/patient.model';

declare var gapi: any;

@Injectable({
    providedIn: 'root'
})
export class GoogleDataService {
    constructor() { }

    public getContact(resourceName: string) {
        const ctx = this;

        return gapi.client.people.people.get({
            // tslint:disable-next-line: object-literal-key-quotes
            'resourceName': resourceName,
            // tslint:disable-next-line: object-literal-key-quotes
            'personFields': 'names,phoneNumbers,photos,birthdays,organizations',
        }).then((response: any) => {
            const patient = ctx.mapPatient(response.result);
            return patient;
        });
    }

    public getContacts() {
        const ctx = this;

        return gapi.client.people.people.connections.list({
            // tslint:disable-next-line: object-literal-key-quotes
            'resourceName': 'people/me',
            // tslint:disable-next-line: object-literal-key-quotes
            'pageSize': 25,
            // tslint:disable-next-line: object-literal-key-quotes
            'personFields': 'names,phoneNumbers,photos,birthdays,organizations',
        }).then((response: any) => {
            const connections = response.result.connections;
            const list = ctx.mapPatients(connections);

            return list;
        });
        // return patientList;
    }

    private mapPatient(patient: any): Patient {
        const mappedPatient: Patient = {
            resourceName: patient.resourceName,
            guid: '',
            name: patient.names[0].givenName,
            surname: patient.names[0].familyName,
            company: patient.organizations[0].name,
            age: this.getAge(patient.birthdays[0].text).toString(),
            cnp: '',
            dob: patient.birthdays[0].text,
            lastConsult: '-',
            imageUrl: patient.photos[0].url
        };
        return mappedPatient;
    }

    private mapPatients(persons: any): Patient[] {
        const patientList: Patient[] = [];
        // console.log(persons);
        // for (var i = 0; i < persons.length; i++) {
        for (const person of persons) {
            // const person = persons[i];
            const patient: Patient = {
                resourceName: person.resourceName,
                guid: persons.indexOf(person),
                name: person.names[0].givenName,
                surname: person.names[0].familyName,
                company: person.organizations[0].name,
                age: this.getAge(person.birthdays[0].text).toString(),
                cnp: '',
                dob: person.birthdays[0].text,
                lastConsult: '-',
                imageUrl: person.photos[0].url
            };
            patientList.push(patient);
        }
        // console.log(patientList);
        return patientList;
    }

    private getAge(dob: string): number {
        const today = new Date();
        const birthDate = new Date(Date.parse(dob));
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }
}
