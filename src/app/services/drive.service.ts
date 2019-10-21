import { Injectable } from '@angular/core';
import { DriveData, PatientMap, DEFAULT_MAPPINGS, MymeType, UserInfo } from '../models/data.model';
import { ContactsService } from './contacts.service';
import { Patient } from '../models/patient.model';
import { HttpClient } from '@angular/common/http';

declare var gapi: any;

@Injectable({
    providedIn: 'root'
})
export class DriveService {
    constructor(private contactsService: ContactsService,
                private http: HttpClient) { }

    public checkIfDbExists(): Promise<boolean> {

        return this.listFilesByParam('name contains \'MedAppDb\'').then(response => {
            const result = response.result;

            if (result.files.length === 0) {
                return false;
            }

            return true;
        });
    }

    public setLocalStorageData() {
        return this.listFilesByParam('name contains \'medapp.mappings\'').then(mappingsResponse => {
            const mappinsResult = mappingsResponse.result.files[0];

            return this.exportFileContent(mappinsResult.id).then(contentResponse => {
                let driveData = {} as DriveData;
                driveData = JSON.parse(contentResponse.substr(1));

                localStorage.setItem('mappingsFileId', JSON.stringify(mappinsResult.id));
                localStorage.setItem('dashboardData', JSON.stringify(driveData.dashboardData));
                localStorage.setItem('patientsListData', JSON.stringify(driveData.patients));

                const googleAuth = gapi.auth2.getAuthInstance();
                const currentUser = googleAuth.currentUser.get().getBasicProfile();

                const userInfo: UserInfo = {
                    id: currentUser.getId(),
                    fullName: currentUser.getName(),
                    givenName: currentUser.getGivenName(),
                    familyName: currentUser.getFamilyName(),
                    imageUrl: currentUser.getImageUrl(),
                    email: currentUser.getEmail()
                };
                localStorage.setItem('userInfo', JSON.stringify(userInfo));
            });
        });
    }

    public initDriveStorage() {
        return this.createDriveFolder('MedAppDb').then(folderResponse => {
            const folderResult = folderResponse.result;

            return this.createDriveFile('medapp.mappings', folderResult.id).then(fileResponse => {
                const fileResult = fileResponse.result;
                const batchFolder = gapi.client.newBatch();

                const mappedData = DEFAULT_MAPPINGS;
                return this.contactsService.getContacts().then((patients: Patient[]) => {
                    if (patients.length !== 0) {
                        for (const patient of patients) {
                            const requestFolder = this.createDriveFileBatch(patient.resourceName, folderResult.id, MymeType.folder);
                            batchFolder.add(requestFolder);
                        }

                        return batchFolder.then(async batchFolderResponse => {
                            const batchFolderResult = batchFolderResponse.result;
                            const batchMappingsFlie = gapi.client.newBatch();
                            const batchConsultsFile = gapi.client.newBatch();
                            const batchXRayFolder = gapi.client.newBatch();
                            const batchPatientFileFolder = gapi.client.newBatch();

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

                                const requestPatientFileFolder =
                                    this.createDriveFileBatch('Patient-Files', folderId, MymeType.folder);

                                batchConsultsFile.add(requestConsultFile);
                                batchMappingsFlie.add(requestMappingsFile);
                                batchXRayFolder.add(requestXRayFolder);
                                batchPatientFileFolder.add(requestPatientFileFolder);

                                mappedPatients.push(mappedPatient);
                            });

                            await this.sleep(1000);

                            return batchMappingsFlie.then(async (batchFileResponse) => {
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

                                await this.sleep(1000);

                                return batchConsultsFile.then(async (batchConsultResponse) => {
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

                                    await this.sleep(1000);

                                    return batchXRayFolder.then(async (batchXRayFolderResponse) => {
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

                                        await this.sleep(1000);

                                        return batchPatientFileFolder.then(async (batchPatientFileFolderResponse) => {
                                            const patientFileFolderResult = batchPatientFileFolderResponse.result;

                                            Object.keys(patientFileFolderResult).map(index => {
                                                const consultFileFolder = patientFileFolderResult[index].result;
                                                const consultFileFolderId = consultFileFolder.id;

                                                const currentMappedPatient = mappedPatients
                                                    .filter(obj =>
                                                        obj.patientFolderId === consultFileFolder.parents[0].id)[0];

                                                const currentMappedIndex = mappedPatients.indexOf(currentMappedPatient);
                                                currentMappedPatient.patientFileFolderId = consultFileFolderId;

                                                mappedPatients[currentMappedIndex] = currentMappedPatient;
                                            });

                                            await this.sleep(1000);

                                            return this.uploadBlankFile('dental.file.blank', folderResult.id)
                                                .then(blankFileId => {
                                                    const dentalFileId = blankFileId;

                                                    return this.uploadBlankFile('patient.file.blank', folderResult.id)
                                                        .then(blankFileId2 => {
                                                            const patientFileId = blankFileId2;

                                                            Object.keys(mappedPatients).map(index => {
                                                                mappedPatients[index].blankDentalFileId = dentalFileId;
                                                                mappedPatients[index].blankPatientFileId = patientFileId;
                                                            });

                                                            mappedData.patients = mappedPatients;

                                                            return this.updateFileContent(fileResult.id, JSON.stringify(mappedData))
                                                                .then(() => {
                                                                    return this.setLocalStorageData().then(() => {
                                                                        console.log('Data mapings and folder hierarchy created');
                                                                    });
                                                                });
                                                        });
                                                });
                                        });
                                    });
                                });
                            });
                        });
                    }
                });
            });
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

    private uploadBlankFile(name: string, parentId: string) {
        // const file = files[0];

        return new Promise((resolve1) => {
            this.http.get(`assets/${name}.pdf`, { responseType: 'blob' }).subscribe((data) => {
                const file = data;

                const boundary = '-------314159265358979323846';
                const delimiter = '\r\n--' + boundary + '\r\n';
                const closedelim = '\r\n--' + boundary + '--';

                const reader = new FileReader();
                reader.readAsBinaryString(file);

                reader.onload = (() => {
                    const contentType = file.type || 'application/octet-stream';
                    const metadata = {
                        title: name,
                        mimeType: contentType,
                        permissions: [
                            { role: 'reader', type: 'anyone' },
                        ],
                        parents: [
                            {
                                id: parentId
                            }
                        ]
                    };

                    const base64Data = btoa(reader.result.toString());
                    const multipartRequestBody =
                        delimiter +
                        'Content-Type: application/json\r\n\r\n' +
                        JSON.stringify(metadata) +
                        delimiter +
                        'Content-Type: ' + contentType + '\r\n' +
                        'Content-Transfer-Encoding: base64\r\n' +
                        '\r\n' +
                        base64Data +
                        closedelim;


                    return this.uploadFileTest(boundary, multipartRequestBody).then((response) => {
                        const uploadedFile = response.result;

                        return this.createPermissions(uploadedFile.id).then(() => {
                            console.log('Blank file uploaded!');
                            resolve1( uploadedFile.id);
                        });
                    });
                });
            });
        });
    }

    private sleep(ms) {
        return new Promise(resolve1 => setTimeout(resolve1, ms));
    }
}
