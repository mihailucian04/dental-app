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
            personFields: 'names,phoneNumbers,photos,birthdays,organizations,emailAddresses',
        }).then((response: any) => {
            const patient = ctx._extractPersonResponse(response.result);
            return patient;
        });
    }

    public getContact1(resourceName: string) {
        return gapi.client.people.people.get({
            resourceName: `people/${resourceName}`,
            personFields: 'names,phoneNumbers,photos,birthdays,organizations,emailAddresses',
        });
    }

    public getContactsBatch(resourceNames) {
        return gapi.client.request({
            method: 'GET',
            path: 'https://people.googleapis.com/v1/people:batchGet',
            params: {
                resourceNames,
                personFields: 'names,phoneNumbers,photos,birthdays,organizations,emailAddresses'
            }
        });
    }

    public getContacts(): Promise<Patient[]> {
        const ctx = this;

        return gapi.client.people.people.connections.list({
            resourceName: 'people/me',
            pageSize: 50,
            personFields: 'names,phoneNumbers,photos,birthdays,organizations,emailAddresses,relations',
        }).then((response: any) => {
            console.log(response);
            const connections = response.result.connections;
            const list = ctx._mapPatients(connections);

            return list;
        });
    }

    public listContactGroups() {
        return gapi.client.request({
            method: 'GET',
            path: 'https://people.googleapis.com/v1/contactGroups'
        });
    }

    public getPatientsContactGroup() {
        return new Promise((resolve) => {
            gapi.client.request({
                method: 'GET',
                path: 'https://people.googleapis.com/v1/contactGroups'
            }).then((response) => {
                const contactGroups = Array.from(response.result.contactGroups);

                contactGroups.map((item: any) => {
                    if (item.name === 'Patients') {
                        resolve(item);
                    }
                });
            });
        });
    }

    public checkIfPatientsGroupExists() {
        return new Promise((resolve) => {
            gapi.client.request({
                method: 'GET',
                path: 'https://people.googleapis.com/v1/contactGroups'
            }).then(response => {
                const contactGroups = response.result.contactGroups;

                for (const contactGroup of contactGroups) {
                    if (contactGroup.name === 'Patients') {
                        resolve(true);
                        break;
                    }
                }
                resolve(false);
            });
        });
    }

    public createPatientsGroup() {
        return gapi.client.request({
            method: 'POST',
            path: 'https://people.googleapis.com/v1/contactGroups',
            body: {
                contactGroup: {
                    name: 'Patients'
                }
            }
        });
    }

    public getPatients(resourceName: string) {
        return gapi.client.request({
            method: 'GET',
            path: `https://people.googleapis.com/v1/${resourceName}`,
            params: {
                maxMembers: 100
            }
        }).then(response => {
            const contactsIds = response.result.memberResourceNames;

            return this.getContactsBatch(contactsIds).then(response1 => {
                const lst = this._extractBatchPatients(response1.result.responses);
                return lst;
            });
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

    private _extractBatchPatients(results) {
        const patientList: Patient[] = [];
        for (const result of results) {
            const patient = this._extractPersonResponse(result.person);
            patientList.push(patient);
        }
        return patientList;
    }


    private _mapPatients(persons: any): Patient[] {
        const patientList: Patient[] = [];
        for (const person of persons) {
            const patient = this._extractPersonResponse(person);
            patientList.push(patient);
        }
        return patientList;
    }

    private _extractPersonResponse(response) {
        const person: Patient = {
            resourceName: response.resourceName.split('/')[1],
            name: response.names[0].givenName,
            surname: response.names[0].familyName,
            company: response.organizations[0].name,
            age: response.birthdays ? this._getAge(response.birthdays[0].text).toString() : '-',
            dob: response.birthdays ? response.birthdays[0].text : '-',
            lastConsult: '-',
            imageUrl: response.photos[0].url,
            email: response.emailAddresses[0].value,
            phoneNumber:  response.phoneNumbers ? response.phoneNumbers[0].value : '(000) 000-0000'
        };

        return person;
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
