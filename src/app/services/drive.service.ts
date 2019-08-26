import { Injectable } from '@angular/core';
import { DriveData, PatientMap } from '../models/data.model';
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
                        const batchFolder = gapi.client.newBatch();

                        const mappedData = DEFAULT_MAPPINGS;
                        this.contactsService.getContacts().then((patients: Patient[]) => {
                            if (patients.length !== 0) {
                                for (const patient of patients) {
                                    const requestFolder = this.createDriveFileBatch(patient.resourceName, folderResult.id, MymeType.folder);
                                    batchFolder.add(requestFolder);
                                }

                                batchFolder.then(batchFolderResponse => {
                                    const batchFolderResult = batchFolderResponse.result;
                                    const batchMappingsFlie = gapi.client.newBatch();
                                    const batchConsultsFile = gapi.client.newBatch();
                                    const batchXRayFolder = gapi.client.newBatch();

                                    const mappedPatients: PatientMap[] = [];

                                    Object.keys(batchFolderResult).map(index => {
                                        const folder = batchFolderResult[index].result;
                                        const folderId = folder.id;

                                        const mappedPatient = {
                                            patientId: folder.title,
                                            patientFolderId: folder.id
                                        };

                                        const requestMappingsFile =
                                            this.createDriveFileBatch('patient.mappings', folderId, MymeType.document);

                                        const requestConsultFile =
                                            this.createDriveFileBatch('consult.mappings', folderId, MymeType.document);

                                        const requestXRayFolder = this.createDriveFileBatch('X-Rays', folderId, MymeType.folder);

                                        batchConsultsFile.add(requestConsultFile);
                                        batchMappingsFlie.add(requestMappingsFile);
                                        batchXRayFolder.add(requestXRayFolder);

                                        mappedPatients.push(mappedPatient);
                                    });

                                    batchMappingsFlie.then((batchFileResponse) => {
                                        console.log('BatchFileResponse', batchFileResponse);
                                        const batchFileResult = batchFileResponse.result;

                                        Object.keys(batchFileResult).map(index => {
                                            const patientFile = batchFileResult[index].result;
                                            const patientFileId = patientFile.id;

                                            const currentMappedPatient = mappedPatients
                                                .filter(obj => obj.patientFolderId === patientFile.parents[0].id)[0];

                                            const currentMappedIndex = mappedPatients.indexOf(currentMappedPatient);
                                            currentMappedPatient.dentalMapFileId = patientFileId;

                                            mappedPatients[currentMappedIndex] = currentMappedPatient;
                                        });

                                        mappedData.patients = mappedPatients;

                                        batchConsultsFile.then((batchConsultResponse) => {
                                            const consultFileResult = batchConsultResponse.result;

                                            Object.keys(consultFileResult).map(index => {
                                                const consultFile = consultFileResult[index].result;
                                                const consultFileId = consultFile.id;

                                                const currentMappedPatient = mappedPatients
                                                    .filter(obj => obj.patientFolderId === consultFile.parents[0].id)[0];

                                                const currentMappedIndex = mappedPatients.indexOf(currentMappedPatient);
                                                currentMappedPatient.consultFileId = consultFileId;

                                                mappedPatients[currentMappedIndex] = currentMappedPatient;
                                            });

                                            mappedData.patients = mappedPatients;

                                            batchXRayFolder.then((batchXRayFolderResponse) => {
                                                const xRaysFolderResult = batchXRayFolderResponse.result;

                                                Object.keys(xRaysFolderResult).map(index => {
                                                    const xRayFolder = xRaysFolderResult[index].result;
                                                    const xRayFolderId = xRayFolder.id;

                                                    const currentMappedPatient = mappedPatients
                                                        .filter(obj => obj.patientFolderId === xRayFolder.parents[0].id)[0];

                                                    const currentMappedIndex = mappedPatients.indexOf(currentMappedPatient);
                                                    currentMappedPatient.xRayFolderId = xRayFolderId;

                                                    mappedPatients[currentMappedIndex] = currentMappedPatient;
                                                });

                                                mappedData.patients = mappedPatients;

                                                this.updateFileContent(fileResult.id, JSON.stringify(mappedData))
                                                    .then(updateFileResponse => {
                                                        console.log('Data mapings and folder hierarchy created');
                                                    });
                                            });
                                        });
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

    public listFolderChildren(folderId: string) {
        return gapi.client.request({
            path: `drive/v2/files/${folderId}/children`,
            method: 'GET'
        });
    }

    public downloadFileTest(fileId: string, token: string) {
        return gapi.client.request({
            path: `drive/v3/files/${fileId}?alt=media`,
            headers: [
                { Authorization: `Bearer ${token}` }
            ]
        });
    }

    public getFileBatch(fileId: string, fields?: string) {
        return gapi.client.drive.files.get({
            fileId,
            fields
        });
    }

    public getDriveFile(fileId: string, fields?: string) {
        if (!fields) {
            fields = '*';
        }
        return gapi.client.drive.files.get({
            fileId,
            fields,
        }).then(response => {
            return response;
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

    public updateFileContentBatch(fileId: string, content: string) {
        return gapi.client.request({
            path: 'upload/drive/v3/files/' + fileId,
            method: 'PATCH',
            params: {
                uploadType: 'media'
            },
            body: content
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
            return response;
        });
    }

    public createDriveFileBatch(fileName: string, parentId: string, mimeType: string) {
        const body = {
            title: fileName,
            mimeType,
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

    public uploadFileTest(boundary: string, body: string) {
        return gapi.client.request({
            path: '/upload/drive/v2/files',
            method: 'POST',
            params: { uploadType: 'multipart' },
            headers: {
                'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
            },
            body
        });
    }

    public createPermissions(fileId: string) {
        return gapi.client.request({
            path: `drive/v3/files/${fileId}/permissions`,
            method: 'POST',
            body: {
                role: 'reader',
                type: 'anyone'
            }
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

    public deleteDriveFile(fileId: string) {
        return gapi.client.drive.files.delete({
            fileId
        });
    }

    public getDriveInfo() {
        return gapi.client.drive.about.get({
            includeSubscribed: true,
            fields: '*'
        });
    }

    public listDrives() {
        return gapi.client.request({
            path: `drive/v3/drives`,
            method: 'GET'
        });
    }
}
