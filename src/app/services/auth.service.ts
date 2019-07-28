import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const CLIENT_ID = '948035237809-2ki059veu26dgnqbr2tfqm9b5qbe079m.apps.googleusercontent.com';
const API_KEY = 'AIzaSyDIQ9RWQwaCtTmkJwXMDxGAPUPieIo5z0Y';
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];
const SCOPES = 'https://www.googleapis.com/auth/drive';

@Injectable({
    providedIn: 'root'
  })
export class AuthService {
    googleAuth: gapi.auth2.GoogleAuth;
    private loggedIn = new BehaviorSubject<boolean>(false);
    private username = new BehaviorSubject<string>('');
    constructor() { }

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
                    resolve();
                });
            });
        });
    }

    get userName() {
        return this.username.asObservable();
    }

    get isLoggedIn() {
        return this.loggedIn.asObservable();
    }

    public signIn() {
        return this.googleAuth.signIn({
            prompt: 'consent'
        }).then((googleUser: gapi.auth2.GoogleUser) => {
            // this.appRepository.User.add(googleUser.getBasicProfile());
            const basicProfile = googleUser.getBasicProfile();

            this.username.next(basicProfile.getEmail());

            basicProfile.getEmail();
            this.loggedIn.next(true);
            console.log('google profile', basicProfile);
        }).catch((error: any) => {
            console.log('error: ', error);
        });
    }

    public getToken() {
        const token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;
        console.log('Google token', token);
    }

    public signOut() {
        this.loggedIn.next(false);
        this.googleAuth.signOut();
    }
}
