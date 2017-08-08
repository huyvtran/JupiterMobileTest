import {Injectable} from '@angular/core';
import {Http, RequestOptions, Headers} from '@angular/http';
import {Storage} from '@ionic/storage';

import {GlobalProvider} from './../core/global-provider';
import {VariablesProvider} from './../core/variables-provider';

import 'rxjs/add/operator/map';
import 'rxjs/Rx';

/*
  Generated class for the LoginService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class LoginProvider {

    refreshToken : string;

    constructor(public http : Http, private storage : Storage) {}

    getToken (pin : string, deviceId : string) {
        console.log("getToken");
        var self = this;
        var value : any;
        return new Promise(function (resolve, reject) {

            let opt : RequestOptions
            let headers : Headers = new Headers

            headers.set('Content-Type', 'application/json');
            let body = {
                "Pin": pin,
                "PushRegistrationId": VariablesProvider.pushRegistrationId,
                "Device": VariablesProvider.device,
            };
            console.log(body);
            let data = JSON.stringify(body);

            opt = new RequestOptions({headers: headers});
            console.log(GlobalProvider.getJupiterServerPath);
            self
                .http
                .post(GlobalProvider.getJupiterServerPath + 'auth/oauth/', data, opt)
                .toPromise()
                .then(result => {
                    value = result.json();
                    VariablesProvider.loginData = value;                    

                    resolve();
                })
                .catch(err => {
                    //resolve();
                    reject(err);
                });
        })
        .then(function () {
            return value;
        })
    }

    getJupiterSystemData(pin: string, eMail: string, password: string) {
        var self = this;
        var value : any;
        return new Promise(function (resolve, reject) {

            let opt : RequestOptions
            let headers : Headers = new Headers

            headers.set('Content-Type', 'application/json');

            let body = {
                "Email": eMail,
                "Password": password
            };

            let data = JSON.stringify(body);
            opt = new RequestOptions({headers: headers});
            self
                .http
                .post(GlobalProvider.getLoginData.serverPath + 'jupitersystem/getdata', data, opt)
                .toPromise()
                .then(result => {
                    value = result.json();
                    
                    if (value.user == null || value.company == null)
                        throw new Error("Neispravni Jupiter Software login podaci. Molim kontaktirajte vašeg Jupiter Software administratora.")
                    else {
                        VariablesProvider.jupiterSystemData = value;
                    }
                    return(value);
                })
                .then(() => {
                    if (value != null)
                        self.updateUser(pin, value.user.login, value.user.name);

                    resolve();
                })
                .catch(err => {
                    reject(err);
                });
        })
        .then(function () {
            return value;
        });
    }

    updateUser(pin: string, login: string, name: string) {
        var self = this;
        return new Promise(function (resolve, reject) {

            let opt : RequestOptions
            let headers : Headers = new Headers

            headers.set('Content-Type', 'application/json');

            let body = {
                "pin": pin,
                "login": login,
                "name": name
            };

            let data = JSON.stringify(body);
            opt = new RequestOptions({headers: headers});
            self
                .http
                .post(GlobalProvider.getJupiterServerPath + 'auth/updateuser', data, opt)
                .toPromise()
                .then(() => {
                        resolve();
                })
                .catch(err => {
                   // reject(err);
                   console.log(err);
                   resolve(); //nebitno za daljnje funkcioniranje app..
                });
        });
    }

    setAccessToken() {
        var data = this.refreshToken;
        this
            .http
            .get(GlobalProvider.getJupiterServerPath + 'auth/oauth/' + data)
            .toPromise()
            .then(result => (window.localStorage.setItem('accessToken', result.json())));
    }
}