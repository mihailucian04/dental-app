import { Injectable } from '@angular/core';
declare var gapi: any;

@Injectable({
    providedIn: 'root'
})
export class DriveService {
    constructor() { }

    public listFiles() {
        return gapi.client.drive.files.list({
            pageSize: 20,
            fields: 'files(id,name,mimeType,webContentLink)',
            orderBy: 'createdTime desc'
        }).then(response => {
            console.log(response);
        });
    }

    public listFilesByParam(param: string) {
        return gapi.client.drive.files.list({
            pageSize: 20,
            fields: 'files(id,name,mimeType,webContentLink)',
            q: param,
            orderBy: 'createdTime desc'
        }).then(response => {
            console.log(response);
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
            mimeType: 'text/plain'
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

    public createDriveFolder() {
        return gapi.client.request({
            path: '/drive/v2/files',
            method: 'POST',
            body: {
                title: 'First folder',
                mimeType: 'application/vnd.google-apps.folder'
            }
        }).then(response => {
            return response;
        });
    }

    public createDriveFile() {
        return gapi.client.request({
            path: '/drive/v2/files',
            method: 'POST',
            body: {
                title: 'First file in folder',
                mimeType: 'application/vnd.google-apps.document',
                parents: [
                    {
                        id: '1CTdusZZGAktVx-Za0GnGHjwCoayuN4S4'
                    }
                ]
            }
        }).then(response => {
            return response;
        });
    }
}
