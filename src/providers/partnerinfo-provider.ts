import {Storage} from '@ionic/storage';
import {Injectable} from '@angular/core';
import {App, ToastController} from 'ionic-angular';
import {Http, RequestOptions, Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';

import {GlobalProvider} from './global-provider';

// import {PartnerSearchPage} from '../pages/partner/search/search' import
// {StorageRoot} from '../models/storage-root' import {Observable} from
// 'rxjs/Observable';

/*
  Generated class for the ParterinfoProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class PartnerinfoProvider {
    private storage : Storage;

    // private storageRoot : any[]; private storageRoot : Array < StorageRoot > =
    // new Array < StorageRoot > ();
    private storageHistoryRoot : Array <any>;
    private storageHistory : Array <any>;

    public locationCnt : number = 0;
    public personsCnt : number = 0;
    public recordsCnt : number = 0;

    public items : any = {};
    public osobe : Array < any >;
    public lokacije : Array < any >;
    public biljeske : any = {};

    public loading : boolean = false;

    public naziv : string = "...";


    private storageKeys : {
        history: string
    } = {
        history: "info.partners.history.001",
    };

    constructor(public http : Http, private app : App, private toastCtrl : ToastController) {
        this.storage = new Storage([]);
        //this.getDataFromStorage();
    }

    InitStorage(id) {
        this.loading = true;
        this.naziv = "...";
        //setTimeout(() => {

        Promise
            .resolve()
            .then(() => {
                if (this.storageHistory != null) {
                    return this.getItemFromData(this.storageHistory, id);
                }
            })
            //set data
            .then((val) => {
                if (val != null) {
                    this.setData(val, id);
                }
                return val;
            })
            // ako je value iz nekog razloga null (u pravilu ne bi trebalo biti) dohvati
            // podatke iz baze
            .then((val) => {
                if (val == null) {
                    this
                        .getServerData(id)
                        .then(data => {
                            this.setData(data, id);
                        })
                }
            })
            .then(() => this.loading = false);
        //}, 3000);
    }

    clearData() {
        this.storageHistoryRoot = new Array < any > ();
        this.storageHistory = new Array < any > ();
    }

    getDataFromStorage() {
        this
            .storage
            .ready()
            .then(() => {
                return this
                    .storage
                    .get(this.storageKeys.history)
                    .then(val => {
                        let data = JSON.parse(val);
                        this.storageHistoryRoot = data;
                        return data;
                    })
                    .then(val => {
                        if (val != null) {
                            let data = val.filter(x => x.db == GlobalProvider.company.db)
                            this.sortData(data);
                            return data;
                        }
                    })
                    .then(val => {
                        if (val == null) {
                            this.clearData();
                        }
                    });
            })
    }

    sortData(data) {
        if (data != null) {
            this.storageHistory = data.sort(function (a, b) {
                // Turn your strings into dates, and then subtract them to get a value that is
                // either negative, positive, or zero.
                var date1 = new Date(a.datum);
                var date2 = new Date(b.datum);
                return date1 < date2;
            });
        }

    }

    getItemFromData(data, id) {
        let filterData = this.getPartnerData(data, id);
        if (filterData.length > 0) {
            return filterData[0];
        }
        return null;
    }

    getItemFromStorage(id) {
        return this
            .storage
            .get(this.storageKeys.history)
            .then(val => {
                let obj = JSON.parse(val);
                if (obj != null) {
                    //return obj.filter(x => x.partneriId == id); this.SetData(test[0]);
                    return this.getPartnerData(obj, id);
                }
            });
    }

    setData(data, id) {
        this.items = data;
        this.osobe = data.osobe;
        this.lokacije = data.lokacije;
        this.biljeske = data.biljeske;
        this.naziv = data.naziv;

        this.locationCnt = this.lokacije.length;
        this.personsCnt = this.osobe.length;
        this.recordsCnt = this.biljeske.length;

        console.log("setData");
        console.log(GlobalProvider.company);
        console.log(data);

        this.addToStorage(data, id);

        this.getDataFromStorage();
    }

    addToStorage(data, id) {

        
        //prvo provjeri da li postoji u storageu
        let checkData = this.getPartnerData(this.storageHistory, id);
        if (checkData.length == 0) {
            //ako ne postoji insertiraj
            this
                .storageHistoryRoot
                .push(data);
            //this.sortData(this.storageHistoryRoot);
            this
                .storage
                .set(this.storageKeys.history, JSON.stringify(this.storageHistoryRoot));
            
        }
    }

    pushData(data) {
        this
            .storageHistoryRoot
            .push(data);
    }

    getPartnerData(obj, id) {
        return obj.filter(x => x.partneriId == id && x.db == GlobalProvider.company.db);
    }

    getServerData(id) {
        let opt : RequestOptions
        let headers : Headers = new Headers

        headers.set('Content-Type', 'application/json');

        let body = {
            "Id": id,
            "Db": GlobalProvider.company.db
        };

        let data = JSON.stringify(body);

        opt = new RequestOptions({headers: headers});

        //var url = 'http://localhost:25509/api/partner/info/' + id;
        var url = GlobalProvider.loginData.serverPath + 'partner/info';

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

    public presentToastError(message : string) {
        let toast = this
            .toastCtrl
            .create({message: message, duration: 5000, position: 'bottom', cssClass: "toast-error"});

        toast.onDidDismiss(() => {});
    }

    close() {
        this
            .app
            .getRootNav()
            .setRoot('PartnerSearchPage', {}, {
                animate: true,
                direction: 'backward'
            });
    }

    findPartner(value) {
        var url = GlobalProvider.loginData.serverPath + 'partner/search/';
        return this
            .http
            .get(url + value)
            //.timeout(1000, null)
            .map(res => res.json())
        //.catch(this.handleError)
    }

    handleError(error) {
        return Observable.throw(error.json().error || 'Server error');
    }
}
