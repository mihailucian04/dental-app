import { Injectable } from '@angular/core';
import { DriveData } from '../models/data.model';
import { ContactsService } from './contacts.service';
import { Patient } from '../models/patient.model';
declare var gapi: any;

export enum MymeType {
    document = 'application/vnd.google-apps.document',
    folder = 'application/vnd.google-apps.folder',
    plainText = 'text/plain'
}

const DEFAULT_MAPPINGS: DriveData = {
    dashboardData: {
        emcPoints: {
            maxPoints: 500,
            points: 150,
        }
    },
    patients: []
};

@Injectable({
    providedIn: 'root'
})
export class DriveService {
    constructor(private contactsService: ContactsService) { }

    public initDriveStorage() {
        this.listFilesByParam('name contains \'MedAppDb\'').then(response => {
            const result = response.result;

            if (result.files.length === 0) {
                this.createDriveFolder('MedAppDb').then(folderResponse => {
                    const folderResult = folderResponse.result;

                    this.createDriveFile('medapp.mappings', folderResult.id).then(fileResponse => {
                        const fileResult = fileResponse.result;
                        const batch = gapi.client.newBatch();

                        const mappedData = DEFAULT_MAPPINGS;
                        this.contactsService.getContacts().then((patients: Patient[]) => {
                            if (patients.length !== 0) {
                                for (const patient of patients) {
                                    const mappedPatient = {
                                        patientId: patient.resourceName
                                    };
                                    mappedData.patients.push(mappedPatient);

                                    const request = this.createDriveFolderBatch(patient.resourceName, folderResult.id);
                                    batch.add(request);
                                }

                                batch.then(() => {
                                    this.updateFileContent(fileResult.id, JSON.stringify(mappedData)).then(updateFileResponse => {
                                        console.log('Data mapings and folder hierarchy created');
                                    });
                                });
                            }
                        });
                    });
                });
            } else {
                this.listFilesByParam('name contains \'medapp.mappings\'').then(mappingsResponse => {
                    const mappinsResult = mappingsResponse.result.files[0];

                    this.exportFileContent(mappinsResult.id).then(contentResponse => {
                        let driveData = {} as DriveData;
                        driveData = JSON.parse(contentResponse.substr(1));
                        console.log(driveData);
                        localStorage.setItem('dashboardData', JSON.stringify(driveData.dashboardData));
                        localStorage.setItem('patientsListData', JSON.stringify(driveData.patients));
                    });
                });
            }
        });
    }

    public listFiles() {
        return gapi.client.drive.files.list({
            pageSize: 20,
            fields: 'files(id,name,mimeType,webContentLink)',
            orderBy: 'createdTime desc'
        }).then(response => {
            return response;
        });
    }

    public listFilesByParam(param: string) {
        return gapi.client.drive.files.list({
            pageSize: 20,
            fields: 'files(id,name,mimeType,webContentLink)',
            q: param,
            orderBy: 'createdTime desc'
        }).then(response => {
            return response;
        });
    }

    public getDriveFile(fileId: string) {
        return gapi.client.drive.files.get({
            fileId,
            fields: 'id,name,mimeType,webContentLink',
        }).then(response => {
            console.log(response);
        });
    }

    public exportFileContent(fileId: string) {
        return gapi.client.drive.files.export({
            fileId,
            mimeType: MymeType.plainText
        }).then((response) => {
            return response.body;
        });
    }

    public updateFileContent(fileId: string, content: string) {
        return gapi.client.request({
            path: '/upload/drive/v3/files/' + fileId,
            method: 'PATCH',
            params: {
                uploadType: 'media'
            },
            body: content
        }).then((response) => {
            console.log(response);
        });
    }

    public createDriveFolderBatch(folderName: string, parentId: string) {
        const body  = {
            title: folderName,
            mimeType: MymeType.folder,
            parents: [
                {
                    id: parentId
                }
            ]
        };

        return gapi.client.request({
            path: '/drive/v2/files',
            method: 'POST',
            body
        });
    }

    public createDriveFolder(folderName: string, parentId?: string) {

        let body = {};
        if (parentId) {
            body = {
                title: folderName,
                mimeType: MymeType.folder,
                parents: [
                    {
                        id: parentId
                    }
                ]
            };
        } else {
            body = {
                title: folderName,
                mimeType: MymeType.folder
            };
        }

        return gapi.client.request({
            path: '/drive/v2/files',
            method: 'POST',
            body
        }).then(response => {
            return response;
        });
    }

    public createDriveFile(fileName: string, parentId: string) {
        return gapi.client.request({
            path: '/drive/v2/files',
            method: 'POST',
            body: {
                title: fileName,
                mimeType: MymeType.document,
                parents: [
                    {
                        id: parentId
                    }
                ]
            }
        }).then(response => {
            return response;
        });
    }
}
