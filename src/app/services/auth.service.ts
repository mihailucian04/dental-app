import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Patient } from '../models/patient.model';
import { DriveService } from './drive.service';
import { tcs } from '../models/tcs';
import { SnackBarService } from './snack-bar.service';
import { UserInfo } from '../models/data.model';

const CLIENT_ID = '948035237809-2ki059veu26dgnqbr2tfqm9b5qbe079m.apps.googleusercontent.com';
const API_KEY = 'AIzaSyDIQ9RWQwaCtTmkJwXMDxGAPUPieIo5z0Y';
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
    'https://www.googleapis.com/discovery/v1/apis/people/v1/rest',
    'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'];
const SCOPES = 'https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/contacts https://www.googleapis.com/auth/calendar';

declare var gapi: any;

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private googleAuth: gapi.auth2.GoogleAuth;

    private loggedIn = new BehaviorSubject<boolean>(false);
    private username = new BehaviorSubject<string>('');
    private initdrive = new BehaviorSubject<boolean>(false);

    constructor(private driveService: DriveService,
                private snackBarService: SnackBarService,
                private ngZone: NgZone) { }

    public initClient() {
        return new Promise((resolve) => {
            gapi.load('client:auth2', () => {
                return gapi.client.init({
                    apiKey: API_KEY,
                    clientId: CLIENT_ID,
                    discoveryDocs: DISCOVERY_DOCS,
                    scope: SCOPES,
                }).then(() => {
                    this.googleAuth = gapi.auth2.getAuthInstance();
                    const currentUser = this.googleAuth.currentUser.get();

                    if (currentUser && currentUser.isSignedIn()) {

                        this.loggedIn.next(true);
                        this.username.next(currentUser.getBasicProfile().getEmail());

                        this.driveService.checkIfDbExists().then(response => {
                            if (response) {
                                this.driveService.setLocalStorageData().then(() => {
                                    this.loggedIn.next(true);
                                    this.username.next(currentUser.getBasicProfile().getEmail());
                                    resolve();
                                });
                            }
                        });
                    }
                    resolve();
                });
            });
        });
    }

    public signIn(): Promise<any> {
        const tsk = tcs();
        this.googleAuth.signIn({
            prompt: 'consent'
        }).then((googleUser: gapi.auth2.GoogleUser) => {

            const basicProfile = googleUser.getBasicProfile();
            this.driveService.checkIfDbExists().then((response) => {

                if (response) {
                    this.driveService.setLocalStorageData().then(() => {
                        this.username.next(basicProfile.getEmail());
                        this.loggedIn.next(true);

                        tsk.resolve();
                    });
                } else {
                    this.ngZone.run(() => {
                        this.initdrive.next(true);
                    });

                    this.driveService.initDriveStorage().then(() => {
                        this.ngZone.run(() => {
                            this.snackBarService.dismiss();
                            this.initdrive.next(false);
                            this.username.next(basicProfile.getEmail());
                            this.loggedIn.next(true);
                        });

                        tsk.resolve();
                    });
                }
            });

        }).catch((error: any) => {
            console.log('error: ', error);
        });

        return tsk.promise;
    }

    public getToken() {
        const token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;
        console.log('Google token', token);
    }

    public signOut() {
        localStorage.clear();
        this.loggedIn.next(false);
        this.googleAuth.signOut();
    }

    get initDrive() {
        return this.initdrive.asObservable();
    }

    get userName() {
        return this.username.asObservable();
    }

    get isLoggedIn() {
        return this.loggedIn.asObservable();
    }
}
