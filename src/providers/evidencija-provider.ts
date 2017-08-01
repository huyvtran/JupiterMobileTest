import {ToastController} from 'ionic-angular';
import {Injectable} from '@angular/core';
import {Http, RequestOptions, Headers} from '@angular/http';
import 'rxjs/add/operator/map';

import {GlobalProvider} from './global-provider';

/*
  Generated class for the EvidencijaProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class EvidencijaProvider {

    public data : any = {};

    constructor(public http : Http, private toastCtrl : ToastController) {
        // console.log('Hello EvidencijaProvider Provider'); Promise
        // .resolve().then(() => {       this.getServerData()         .subscribe(data =>
        // {           this.data = data;           console.log(data);         });   })
    }

    getServerData() {
        let opt : RequestOptions
        let headers : Headers = new Headers

        headers.set('Content-Type', 'application/json');

        let body = {
            "Db": GlobalProvider.company.db
        };

        let data = JSON.stringify(body);

        opt = new RequestOptions({headers: headers});

        var url = GlobalProvider.loginData.serverPath + 'hrm/odsustva';

        var response = this
            .http
            .post(url, data, opt)
            .toPromise()
            .then(result => result.json())
            .catch(err => {
                this.presentToastError(err._body);
            });
        return response;
    }

    reviver(key, value) : any
    {
        if ('endTime' === key || 'startTime' === key) {
            //you can use any de-serialization algorithm here
            return new Date(value);
        } else if ('employee' === key) {
            return value.toLowerCase();
            // return value.replace(/\w\S*/g, function(txt){return
            // txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        }
        return value;
    }

    // sentenceCase (str) {   if ((str===null) || (str===''))       return "";
    // else {     str = str.toString();     return str;   }   //return
    // str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() +
    // txt.substr(1).toLowerCase();}); }

    public presentToastError(message : string) {
        let toast = this
            .toastCtrl
            .create({message: message, duration: 5000, position: 'bottom', cssClass: "toast-error"});

        toast.onDidDismiss(() => {});
    }

}
