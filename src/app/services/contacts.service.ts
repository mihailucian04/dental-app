import { Injectable } from '@angular/core';
import { Patient, NewPatient } from '../models/patient.model';
declare var gapi: any;

@Injectable({
    providedIn: 'root'
})
export class ContactsService {
    public getContact(resourceName: string): Promise<Patient> {
        const ctx = this;

        return gapi.client.people.people.get({
            resourceName: `people/${resourceName}`,
            personFields: 'names,phoneNumbers,photos,birthdays,organizations',
        }).then((response: any) => {
            const patient = ctx.mapPatient(response.result);
            return patient;
        });
    }

    public getContacts(): Promise<Patient[]> {
        const ctx = this;

        return gapi.client.people.people.connections.list({
            resourceName: 'people/me',
            pageSize: 50,
            personFields: 'names,phoneNumbers,photos,birthdays,organizations',
        }).then((response: any) => {
            const connections = response.result.connections;
            const list = ctx._mapPatients(connections);

            return list;
        });
    }

    public addNewPatient(patient: NewPatient) {
        return gapi.client.request({
            method: 'POST',
            path: 'https://people.googleapis.com/v1/people:createContact',
            dataType: 'jsonp',
            body: {
                names: [
                    {
                        givenName: patient.firstName,
                        familyName: patient.lastName
                    }
                ],
                emailAddresses: [
                    {
                        value: patient.emailAddress
                    }
                ],
                phoneNumbers: [
                    {
                        value: patient.phoneNumber
                    }
                ],
                birthdays: [
                    {
                        date: {
                            day: 11,
                            month: 7,
                            year: 1990
                        }
                    }
                ],
                organizations: [
                    {
                        name: patient.company
                    }
                ]
            }
        });
    }

    private mapPatient(patient: any): Patient {
        const mappedPatient: Patient = {
            resourceName: patient.resourceName.split('/')[1],
            guid: '',
            name: patient.names[0].givenName,
            surname: patient.names[0].familyName,
            company: patient.organizations[0].name,
            age: this._getAge(patient.birthdays[0].text).toString(),
            cnp: '',
            dob: patient.birthdays[0].text,
            lastConsult: '-',
            imageUrl: patient.photos[0].url
        };
        return mappedPatient;
    }

    private _mapPatients(persons: any): Patient[] {
        const patientList: Patient[] = [];
        for (const person of persons) {
            const patient: Patient = {
                resourceName: person.resourceName.split('/')[1],
                guid: persons.indexOf(person),
                name: person.names[0].givenName,
                surname: person.names[0].familyName,
                company: person.organizations[0].name,
                age: this._getAge(person.birthdays[0].text).toString(),
                cnp: '',
                dob: person.birthdays[0].text,
                lastConsult: '-',
                imageUrl: person.photos[0].url
            };
            patientList.push(patient);
        }
        return patientList;
    }

    private _getAge(dob: string): number {
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
