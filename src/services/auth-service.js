import {Aurelia} from 'aurelia-framework';
import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';

@inject(Aurelia, HttpClient)
export class AuthService {
    _tokenName = "HackathonPlanner";
    
    // As soon as the AuthService is created, we query local storage to
    // see if the login information has been stored. If so, we immediately
    // load it into the session object on the AuthService.
    constructor(Aurelia, HttpClient) {

        HttpClient.configure(http => {
            http.withBaseUrl('/');
        });

        this.http = HttpClient;
        this.app = Aurelia;

        //this.session = JSON.parse(localStorage[this._tokenName] || null);
        this.session = localStorage[this._tokenName] || null;
    }

    // The login function needs to abstract away all of the details about
    // how we track and expose login information. A more advanced app might
    // want the login function to pass back a promise so it can perform
    // additional tasks on login, but we keep things simple here.
    login(username, password) {
        // this.http
        //     .post(config.loginUrl, { username, password })
        //     .then((response) => response.content)
        //     .then((session) => {
        //         localStorage[this._tokenName] = JSON.stringify(session);
        //         this.session = session;
        //         this.app.setRoot('app');
        //     });
        
        localStorage[this._tokenName] = username;
        this.session = username;
        this.app.setRoot('app')
    }

    // The logout function reverses the actions of the login function. 
    // It is less common for logout to be async, but logout could also
    // return a promise if there were a need.
    logout() {
        localStorage.removeItem(this._tokenName);
        this.session = null;
        this.app.setRoot('login')
    }

    // A basic method for exposing information to other modules.  
    isAuthenticated() {
        return this.session !== null;
    }
    
    get Username(){
        return this.session;
    }
}